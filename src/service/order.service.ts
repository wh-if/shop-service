import { Injectable } from '@nestjs/common';
import { Order } from 'src/entity/order.entity';
import {
  OrderListQueryDTO,
  OrderInsertDTO,
  OrderDetailInsertDTO,
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
  OrderDetailType,
  PAY_TYPE,
} from 'src/common/constant';
import { ProductService } from './product.service';
import { SetsService } from './sets.service';
import { Coupon } from 'src/entity/coupon.entity';

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
    const sqlBuilder = this.orderQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize);
    if (query.orderBy && query.order) {
      sqlBuilder.orderBy({ [query.orderBy]: query.order });
    }

    this.genWhereSql<Order, OrderListQueryDTO>(sqlBuilder, 'order', query, {
      stringType: ['id'],
      timeType: ['createTime', 'finishTime', 'payTime'],
      enumType: ['userId', 'orderType', 'payType', 'status'],
      numberType: ['payAmount'],
    });

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findOrderById(id: number) {
    return this.orderQBuilder
      .where({ id })
      .leftJoinAndSelect('order.items', 'order_detail')
      .getOne();
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
    this.calculateOrderDetail(order, dto.items);

    return this.dataSource.getRepository(Order).save(order);
  }

  // 更改订单状态, 支付和取消走单独方法
  changeOrderStatus(id: number, status: ORDER_STATUS) {
    const finishTime =
      status === ORDER_STATUS.FINISHED ? new Date() : undefined;
    return this.orderQBuilder
      .update()
      .set({ status, finishTime })
      .where({ id })
      .execute();
  }

  // 取消订单
  async cancelOrder(id: number) {
    const order = await this.orderQBuilder.where({ id }).getOne();
    if (order.status === ORDER_STATUS.FINISHED) {
      return '订单已完成，无法取消';
    }

    // 恢复优惠券可用状态
    this.couponService.changeReceivedCouponStatus(
      order.couponIds,
      order.userId,
      false,
    );

    return this.orderQBuilder
      .update()
      .set({ status: ORDER_STATUS.CANCEL })
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
  async deleteOrder(id: number) {
    const order = await this.orderQBuilder.where({ id }).getOne();
    if (
      order.status !== ORDER_STATUS.CANCEL &&
      order.status !== ORDER_STATUS.FINISHED
    ) {
      return '订单当前状态不可删除';
    }
    return this.orderQBuilder.delete().where({ id }).execute();
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

    // 计算子项
    for (let index = 0; index < orderItems.length; index++) {
      const element = orderItems[index];
      const orderDetail = new OrderDetail(
        element.type,
        element.targetId,
        element.quantity,
        element.chooseOption,
      );

      if (element.type === OrderDetailType.PRODUCT) {
        const product = await this.productService.findProductById(
          element.targetId,
        );
        const productChoosedOption = product.options.find(
          (i) => i.id === element.chooseOption[0],
        );
        orderDetail.totalAmount =
          productChoosedOption.price * orderDetail.quantity;
        orderDetail.discountAmount = orderDetail.totalAmount;

        // 当前订单和产品可以用的优惠券
        const couponCanUse = (
          await this.couponService.getCouponsByProduct(element.targetId)
        ).filter((i) => unusedCoupons.includes(i.id));

        // 如果有优惠券可用，寻找最佳的优惠券和优惠价格
        if (couponCanUse.length > 0) {
          couponCanUse.forEach((c) => {
            // 金额不满足，无法使用
            if (orderDetail.totalAmount < c.needFull) {
              return;
            }
            let curAmount: number;

            if (c.type === COUPON_TYPE.CUT) {
              curAmount = orderDetail.totalAmount - c.amount;
            } else if (c.type === COUPON_TYPE.PERCENTAGE) {
              curAmount = orderDetail.totalAmount * c.amount;
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
      } else if (element.type === OrderDetailType.SETS) {
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
          orderDetail.totalAmount += productChoosedOption.price;
        }

        // 套餐优惠
        if (sets.type === COUPON_TYPE.CUT) {
          orderDetail.discountAmount = orderDetail.totalAmount - sets.amount;
        } else if (sets.type === COUPON_TYPE.PERCENTAGE) {
          orderDetail.discountAmount = orderDetail.totalAmount * sets.amount;
        }

        // 处理数量
        orderDetail.totalAmount =
          orderDetail.totalAmount * orderDetail.quantity;
        orderDetail.discountAmount =
          orderDetail.discountAmount * orderDetail.quantity;
      }

      order.payAmount += orderDetail.discountAmount;
      order.amount += orderDetail.totalAmount;

      order.items.push(orderDetail); // TODO
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
}
