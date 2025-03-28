import { Injectable } from '@nestjs/common';
import { Order } from 'src/entity/order.entity';
import {
  OrderListQueryDTO,
  OrderInsertDTO,
  OrderDetailInsertDTO,
  OrderWithAvatar,
} from 'src/dto/order.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { CouponService } from './coupon.service';
import { OrderDetail } from 'src/entity/order_detail.entity';
import {
  COUPON_TARGET,
  COUPON_TYPE,
  ORDER_STATUS,
  ORDER_DETAIL_TYPE,
  PAY_TYPE,
} from 'src/common/constant';
import { ProductService } from './product.service';
import { SetsService } from './sets.service';
import { Coupon } from 'src/entity/coupon.entity';
import { Product } from 'src/entity/product.entity';
import { Sets } from 'src/entity/sets.entity';

type TargetParam = {
  targetId: number;
} & (
  | { targetType: ORDER_DETAIL_TYPE; type?: never }
  | { type: ORDER_DETAIL_TYPE; targetType?: never }
);

@Injectable()
export class OrderService extends BaseService {
  constructor(
    private dataSource: DataSource,
    private couponService: CouponService,
    private productService: ProductService,
    private setsService: SetsService,
  ) {
    super();
  }

  public get orderQBuilder(): SelectQueryBuilder<Order> {
    return this.dataSource.createQueryBuilder(Order, 'order');
  }

  async getOrderList(query: OrderListQueryDTO, page: ListPageParam) {
    let result: (OrderWithAvatar | Order)[] = [];
    let totalCount: number = 0;

    if (query.ids) {
      const [list, total] = await this.orderQBuilder
        .leftJoinAndSelect('order.items', 'order_detail')
        .where('order.id IN (:...ids)', { ids: query.ids })
        .getManyAndCount();
      totalCount = total;
      result = list;
    } else {
      const subSqlBuilder = this.withPageOrderBuilder(this.orderQBuilder, {
        page: page.page,
        pageSize: page.pageSize,
        order: query.order,
        orderBy: query.orderBy,
      });

      this.genWhereSql<Order, OrderListQueryDTO>(
        subSqlBuilder,
        'order',
        query,
        {
          stringType: ['id'],
          timeType: ['createTime', 'finishTime', 'payTime'],
          enumType: ['userId', 'orderType', 'payType', 'status'],
          numberType: ['payAmount'],
        },
      );

      const [idList, total] = await subSqlBuilder
        .select('order.id')
        .getManyAndCount();
      if (idList.length === 0) {
        return {
          list: [],
          total: 0,
        };
      }

      const list = await this.orderQBuilder
        .leftJoinAndSelect('order.items', 'order_detail')
        .where(`order.id IN (:...ids)`, {
          ids: idList.map((o) => o.id),
        })
        .getMany();
      totalCount = total;
      result = list;
    }

    // 获取订单的头像
    for (let index = 0; index < result.length; index++) {
      const item = result[index].items[0];
      if (!item) {
        continue;
      }
      let rawInfo: Product | Sets;
      if (item.type === ORDER_DETAIL_TYPE.PRODUCT) {
        rawInfo = await this.productService.findProductById(item.targetId);
      } else if (item.type === ORDER_DETAIL_TYPE.SETS) {
        rawInfo = await this.setsService.findSetsById(item.targetId);
      }
      (result[index] as OrderWithAvatar).avatar = rawInfo.avatar;
    }

    return {
      list: result,
      total: totalCount,
    };
  }

  async findOrderById(id: number) {
    const order = await this.orderQBuilder
      .where({ id })
      .leftJoinAndSelect('order.items', 'order_detail')
      .getOne();

    const items = await this.withTargetData(order.items);
    return {
      ...order,
      items,
    };
  }

  async insertOrder(dto: OrderInsertDTO, userId: number) {
    // 检查优惠券是否拥有
    const checkCouponResult = await this.couponService.checkCoupon(
      dto.couponIds,
      userId,
    );
    if (!checkCouponResult) {
      return '订单创建失败，优惠券使用异常，请重新确认。';
    }

    const order = new Order(
      dto.orderType,
      new Date(parseInt(dto.expectTime)),
      dto.note,
      dto.couponIds,
      userId,
    );

    // 计算订单子项目明细
    await this.calculateOrderDetail(order, dto.items);

    return this.dataSource.getRepository(Order).save(order);
  }

  // 更改订单状态, 支付和取消走单独方法
  changeOrderStatus(ids: number[], status: ORDER_STATUS) {
    const finishTime =
      status === ORDER_STATUS.FINISHED ? new Date() : undefined;
    return this.orderQBuilder
      .update()
      .set({ status, finishTime })
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  // 取消/删除订单
  async cancelOrRemoveOrder(
    id: number,
    type: ORDER_STATUS.CANCEL | ORDER_STATUS.REMOVED,
    curUserId: number,
  ) {
    const order = await this.orderQBuilder
      .where({ id, userId: curUserId })
      .getOne();

    if (!order) {
      return '订单不存在，请重新确认后再操作！';
    }

    if (type === ORDER_STATUS.CANCEL) {
      // 只有待支付和待处理状态可以取消
      if (
        order.status !== ORDER_STATUS.WAIT_PAY &&
        order.status !== ORDER_STATUS.WAIT_HANDLE
      ) {
        return '订单当前状态无法取消';
      }
      // 恢复优惠券可用状态
      this.couponService.changeReceivedCouponStatus(
        order.couponIds,
        order.userId,
        false,
      );
    } else if (type === ORDER_STATUS.REMOVED) {
      // 只有完成和取消状态可以删除
      if (
        order.status !== ORDER_STATUS.CANCEL &&
        order.status !== ORDER_STATUS.FINISHED
      ) {
        return '订单当前状态无法删除！';
      }
    }

    return this.orderQBuilder
      .update()
      .set({ status: type })
      .where({ id })
      .execute();
  }

  /**
   * 支付订单
   * @param id
   * @param payType
   * @returns
   */
  async payOrder(id: number, payType: PAY_TYPE) {
    const order = await this.orderQBuilder.where({ id }).getOne();
    if (order.status !== ORDER_STATUS.WAIT_PAY) {
      return false;
    }
    const payTime = new Date();
    return this.orderQBuilder
      .update()
      .set({ status: ORDER_STATUS.WAIT_HANDLE, payTime, payType })
      .where({ id })
      .execute();
  }

  /**
   * 只有完成和取消状态可以删除订单
   * @param id
   * @returns
   */
  async deleteOrder(ids: number[]) {
    const executeIds: number[] = [];

    ids.forEach(async (id) => {
      const order = await this.orderQBuilder.where({ id }).getOne();
      if (
        order.status === ORDER_STATUS.CANCEL ||
        order.status === ORDER_STATUS.FINISHED ||
        order.status === ORDER_STATUS.REMOVED
      ) {
        executeIds.push(id);
      }
    });
    await this.orderQBuilder
      .delete()
      .where('id IN (:...ids)', { ids: executeIds })
      .execute();
    return executeIds;
  }

  /**
   * 计算订单子项目明细
   */
  private async calculateOrderDetail(
    order: Order,
    orderItems: OrderDetailInsertDTO[],
  ) {
    let unusedCoupons = [...order.couponIds];
    order.payAmount = 0;
    order.amount = 0;
    order.items = [];
    // 计算子项
    for (let index = 0; index < orderItems.length; index++) {
      const element = orderItems[index];
      const orderDetail = new OrderDetail(
        element.type,
        element.targetId,
        element.quantity,
        element.chooseOption,
      );

      if (element.type === ORDER_DETAIL_TYPE.PRODUCT) {
        const product = await this.productService.findProductById(
          element.targetId,
        );
        const productChoosedOption = product.options.find(
          (i) => i.id === element.chooseOption[0],
        );
        orderDetail.totalAmount =
          productChoosedOption.originalPrice * orderDetail.quantity;
        orderDetail.discountAmount =
          productChoosedOption.price * orderDetail.quantity;

        // 当前订单和产品可以用的优惠券
        const couponCanUse = (
          await this.couponService.getCouponsByProduct(element.targetId)
        ).filter((i) => unusedCoupons.includes(i.id));

        // 如果有优惠券可用，寻找最佳的优惠券和优惠价格
        if (couponCanUse.length > 0) {
          // 未使用优惠券应支付的金额
          const price = orderDetail.discountAmount;
          couponCanUse.forEach((c) => {
            // 支付金额不满足，无法使用
            if (orderDetail.discountAmount < c.needFull) {
              return;
            }
            let curAmount: number;

            if (c.type === COUPON_TYPE.CUT) {
              curAmount = price - c.amount;
            } else if (c.type === COUPON_TYPE.PERCENTAGE) {
              curAmount = price * c.amount;
            }
            if (curAmount && curAmount < orderDetail.discountAmount) {
              orderDetail.useCoupon = c.id;
              orderDetail.discountAmount = curAmount;
            }
          });
          unusedCoupons = unusedCoupons.filter(
            (i) => i !== orderDetail.useCoupon,
          );
        }
      } else if (element.type === ORDER_DETAIL_TYPE.SETS) {
        const sets = await this.setsService.findSetsById(element.targetId);
        orderDetail.totalAmount = 0;

        // 原价格
        for (let pIndex = 0; pIndex < sets.products.length; pIndex++) {
          const product = await this.productService.findProductById(
            sets.products[pIndex].id,
          );
          const productChoosedOption = product.options.find(
            (i) => i.id === element.chooseOption[pIndex],
          );
          orderDetail.totalAmount += productChoosedOption.originalPrice;
          orderDetail.discountAmount += productChoosedOption.price;
        }

        // 套餐优惠
        if (sets.type === COUPON_TYPE.CUT) {
          orderDetail.discountAmount = orderDetail.discountAmount - sets.amount;
        } else if (sets.type === COUPON_TYPE.PERCENTAGE) {
          orderDetail.discountAmount = orderDetail.discountAmount * sets.amount;
        }

        // 处理数量
        orderDetail.totalAmount =
          orderDetail.totalAmount * orderDetail.quantity;
        orderDetail.discountAmount =
          orderDetail.discountAmount * orderDetail.quantity;
      }
      order.payAmount += orderDetail.discountAmount;
      order.amount += orderDetail.totalAmount;

      order.items.push(orderDetail);
    }

    // 计算订单优惠券使用
    const orderCoupon = (
      (await this.couponService.findCouponById(unusedCoupons)) as Coupon[]
    ).filter((c) => c.target === COUPON_TARGET.ORDER);
    if (orderCoupon.length > 0) {
      let useCouponId: number;
      orderCoupon.forEach((c) => {
        // 金额不满足，无法使用
        if (order.amount < c.needFull) {
          return;
        }
        let curAmount: number;

        if (c.type === COUPON_TYPE.CUT) {
          curAmount = order.amount - c.amount;
        } else if (c.type === COUPON_TYPE.PERCENTAGE) {
          curAmount = order.amount * c.amount;
        }
        if (curAmount && curAmount < order.payAmount) {
          useCouponId = c.id;
          order.payAmount = curAmount;
        }
      });
      unusedCoupons = unusedCoupons.filter((i) => i !== useCouponId);
    }

    // 更改使用了的优惠券状态
    order.couponIds = order.couponIds.filter((i) => !unusedCoupons.includes(i));
    this.couponService.changeReceivedCouponStatus(
      order.couponIds,
      order.userId,
      true,
    );
  }

  /**
   * 处理商品和套餐的混合数据
   * @param list
   * @returns
   */
  async withTargetData<T>(list: (T & TargetParam)[]) {
    // 分类产品和套装
    const sIds: number[] = [],
      pIds: number[] = [];
    list.forEach((item) => {
      const targetType = item.targetType || item.type;
      if (targetType === ORDER_DETAIL_TYPE.PRODUCT) {
        pIds.push(item.targetId);
      } else if (targetType === ORDER_DETAIL_TYPE.SETS) {
        sIds.push(item.targetId);
      }
    });

    // 分别获取数据
    const { list: pList } = await this.productService.getProductList({
      ids: pIds,
    });
    const { list: sList } = await this.setsService.getSetsList({ ids: sIds });

    // 按原列表顺序填充
    const targetList: (T & { target: Product | Sets })[] = [];
    list.forEach((item) => {
      let target: Product | Sets;
      const targetType = item.targetType || item.type;
      if (targetType === ORDER_DETAIL_TYPE.PRODUCT) {
        target = pList.find((i) => i.id === item.targetId);
      } else if (targetType === ORDER_DETAIL_TYPE.SETS) {
        target = sList.find((i) => i.id === item.targetId);
      }
      targetList.push({
        ...item,
        target,
      });
    });

    return targetList;
  }
}
