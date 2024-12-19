import { Injectable } from '@nestjs/common';
import { Coupon } from 'src/entity/coupon.entity';
import {
  CouponListOrderDTO,
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

  async getCouponList(
    query: CouponListQueryDTO,
    order: CouponListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.couponQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<Coupon, CouponListQueryDTO>(sqlBuilder, 'coupon', query, {
      stringType: ['id'],
      timeType: ['startDate', 'endDate'],
      enumType: ['status', 'target', 'type'],
      numberType: [],
    });

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findCouponById(id: number) {
    return this.couponQBuilder
      .where({ id })
      .leftJoinAndSelect('coupon.products', 'product')
      .getOne();
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

  deleteCoupon(id: number) {
    return this.couponQBuilder.delete().where({ id }).execute();
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

    return true;
  }

  /**
   * 使用优惠券，更新领取的优惠券使用状态
   * @param couponIds
   * @returns
   */
  async useCoupon(couponIds: number[], userId: number) {
    const coupons = await this.dataSource
      .createQueryBuilder(ReceivedCoupon, 'received_coupon')
      .where('userId = :userId', { userId })
      .andWhere('`couponId` IN (:...couponIds)', { couponIds })
      .getMany();

    for (let i = 0; i < coupons.length; i++) {
      coupons[i].hasUsed = true;
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
}
