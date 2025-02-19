/* eslint-disable */
import { COUPON_TYPE, COUPON_TARGET, COUPON_STATUS } from '@/common/constant';
import { List, Product } from '.';

export declare namespace Coupon {
  interface Coupon {
    id: number;
    type: COUPON_TYPE;
    needFull: number; // 满多少享受折扣
    amount: number; // 折扣数额或打折比例
    receiveLimit: number; // 单用户领取数量限制
    target: COUPON_TARGET; // 作用对象
    totalQuantity: number; // 优惠券总数量
    remainingQuantity: number; // 剩余可用数量
    startDate: string; // 优惠券开始日期
    endDate: string; // 优惠券结束日期
    createDate: string; // 优惠券创建时间
    updateDate: string; // 优惠券最后更新时间
    status: COUPON_STATUS; // 优惠券状态
    description: string; // 备注、描述信息
    products: Product.Product[];
  }

  type InsertParam = Omit<Coupon, 'createDate' | 'updateDate' | 'products' | 'id'> & {
    productIds: number[];
  };

  type UpdateParam = Pick<Coupon, 'id'> & Partial<InsertParam>;

  type ListQueryParam = List.QueryParam<
    Coupon,
    'id' | 'type' | 'target' | 'startDate' | 'endDate' | 'status' | 'createDate' | 'updateDate',
    'id' | 'startDate' | 'endDate' | 'createDate' | 'updateDate'
  >;
}
