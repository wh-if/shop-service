import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Coupon } from 'src/entity/coupon.entity';

export type CouponUpdateDTO = Omit<
  Coupon,
  'createDate' | 'updateDate' | 'products' | 'startDate' | 'endDate'
> & { startDate: string; endDate: string; productIds: number[] };

export type CouponInsertDTO = Omit<
  Coupon,
  'createDate' | 'updateDate' | 'products' | 'id' | 'startDate' | 'endDate'
> & { startDate: string; endDate: string; productIds: number[] };

export type CouponListQueryDTO = ListQueryParam<
  Coupon,
  'id' | 'type' | 'target' | 'startDate' | 'endDate' | 'status'
>;

export type CouponListOrderDTO = ListOrderType<
  Coupon,
  | 'id'
  | 'needFull'
  | 'totalQuantity'
  | 'remainingQuantity'
  | 'startDate'
  | 'endDate'
  | 'createDate'
  | 'updateDate'
>;
