import { Injectable } from '@nestjs/common';
import { Coupon } from 'src/entity/coupon.entity';
import {
  CouponListQueryDTO,
  CouponInsertDTO,
  CouponUpdateDTO,
} from 'src/dto/coupon.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { Product } from 'src/entity/product.entity';
import { ReceivedCoupon } from 'src/entity/received_coupon.entity';

@Injectable()
export class CouponService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get couponQBuilder(): SelectQueryBuilder<Coupon> {
    return this.dataSource.createQueryBuilder(Coupon, 'coupon');
  }

  async getCouponList(query: CouponListQueryDTO, page: ListPageParam) {
    const subSqlBuilder = this.withPageOrderBuilder(this.couponQBuilder, {
      page: page.page,
      pageSize: page.pageSize,
      order: query.order,
      orderBy: query.orderBy,
    });

    this.genWhereSql<Coupon, CouponListQueryDTO>(
      subSqlBuilder,
      'coupon',
      query,
      {
        stringType: ['id'],
        timeType: ['startDate', 'endDate', 'createDate', 'updateDate'],
        enumType: ['status', 'target', 'type'],
        numberType: [],
      },
    );

    const [idList, total] = await subSqlBuilder
      .select('coupon.id')
      .getManyAndCount();

    const list = await this.couponQBuilder
      .leftJoinAndSelect('coupon.products', 'product')
      .where(`coupon.id IN (:...ids)`, {
        ids: idList.map((c) => c.id),
      })
      .getMany();
    return {
      list,
      total,
    };
  }

  async findCouponById(id: number | number[]) {
    const isArray = Array.isArray(id);
    if (!isArray) {
      id = [id as number];
    }
    const result = await this.couponQBuilder
      .where('id IN (:...id)', { id })
      .leftJoinAndSelect('coupon.products', 'product')
      .getMany();
    return isArray ? result : result[0];
  }

  async insertCoupon(dto: CouponInsertDTO) {
    const coupon = new Coupon();
    coupon.amount = dto.amount;
    coupon.needFull = dto.needFull;
    coupon.receiveLimit = dto.receiveLimit;
    coupon.remainingQuantity = dto.remainingQuantity;
    coupon.status = dto.status;
    coupon.target = dto.target;
    coupon.totalQuantity = dto.totalQuantity;
    coupon.type = dto.type;
    coupon.description = dto.description;
    coupon.startDate = dto.startDate && new Date(parseInt(dto.startDate));
    coupon.endDate = dto.endDate && new Date(parseInt(dto.endDate));
    coupon.products = [];

    if (dto.productIds?.length > 0) {
      coupon.products = await this.dataSource
        .createQueryBuilder(Product, 'product')
        .where('id IN (:...ids)', { ids: dto.productIds })
        .getMany();
    }

    await this.dataSource.getRepository(Coupon).save(coupon);

    return true;
  }

  async updateCoupon(dto: CouponUpdateDTO) {
    const { productIds, ...updateParams } = dto;

    // 值为undefined时不会更新到数据库
    const startDate =
      dto.startDate && new Date(parseInt(updateParams.startDate));
    const endDate = dto.endDate && new Date(parseInt(updateParams.endDate));
    let products: Product[];
    if (productIds?.length > 0) {
      products = await this.dataSource
        .createQueryBuilder(Product, 'product')
        .where('id IN (:...ids)', { ids: productIds })
        .getMany();
    } else if (productIds?.length === 0) {
      products = [];
    }

    await this.dataSource
      .getRepository(Coupon)
      .save({ ...updateParams, startDate, endDate, products });
    return true;
  }

  async deleteCoupon(ids: number[]) {
    // 同时删除领取记录
    await this.dataSource
      .createQueryBuilder(ReceivedCoupon, 'received_coupon')
      .delete()
      .where('couponId IN (:...ids)', { ids })
      .execute();

    await this.couponQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  /**
   * 领取优惠券
   * @param userId
   * @param couponId
   * @returns
   */
  async receiveCoupon(userId: number, couponId: number) {
    const rc = await this.dataSource
      .createQueryBuilder(ReceivedCoupon, 'received_coupon')
      .where('userId = :userId', { userId })
      .andWhere('couponId = :couponId', { couponId })
      .getOne();
    if (!!rc) {
      return false;
    }

    const receiveCoupon = new ReceivedCoupon(userId, couponId);
    await this.dataSource.getRepository(ReceivedCoupon).save(receiveCoupon);

    // 更新剩余可用数量
    await this.couponQBuilder
      .update()
      .set({ remainingQuantity: () => "'remainingQuantity' - 1" })
      .where({ id: couponId })
      .execute();

    return true;
  }

  /**
   * 使用优惠券，更新领取的优惠券使用状态
   * 取消订单恢复优惠券使用状态
   * @param couponIds
   * @param userId
   * @param recover
   * @returns
   */
  async changeReceivedCouponStatus(
    couponIds: number[],
    userId: number,
    used: boolean,
  ) {
    const coupons = await this.dataSource
      .createQueryBuilder(ReceivedCoupon, 'received_coupon')
      .where('userId = :userId', { userId })
      .andWhere('`couponId` IN (:...couponIds)', { couponIds })
      .getMany();

    for (let i = 0; i < coupons.length; i++) {
      coupons[i].hasUsed = used;
    }
    await this.dataSource.getRepository(ReceivedCoupon).save(coupons);
    return true;
  }

  /**
   * 我的优惠券列表(未使用的)
   * @param userId
   * @returns
   */
  async getCouponsByUser(userId: number) {
    const coupons = await this.dataSource
      .createQueryBuilder(ReceivedCoupon, 'received_coupon')
      .where('userId = :userId', { userId })
      .andWhere('hasUsed = 0')
      .getMany();
    return coupons;
  }

  /**
   * 产品的可用优惠券
   * @param productId
   * @returns
   */
  async getCouponsByProduct(productId: number) {
    const product = await this.dataSource
      .createQueryBuilder(Product, 'product')
      .where({ id: productId })
      .leftJoinAndSelect('product.coupons', 'coupon')
      .getOne();

    return product.coupons;
  }

  /**
   * 检查优惠券是否拥有
   */
  async checkCoupon(couponIds: number[], userId: number) {
    const couponIdsOfUser = (await this.getCouponsByUser(userId)).map(
      (item) => item.couponId,
    );
    const result = couponIds.some((item) => !couponIdsOfUser.includes(item));
    return result;
  }
}
