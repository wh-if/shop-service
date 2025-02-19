import { COUPON_STATUS, COUPON_TARGET, COUPON_TYPE } from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
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
  | 'id'
  | 'type'
  | 'target'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'createDate'
  | 'updateDate'
>;

export const CouponValidator: Partial<
  Record<keyof Coupon | 'productIds', Validator>
> = {
  id: Validator.validate('id').number(),
  type: Validator.validate('').enum(COUPON_TYPE),
  needFull: Validator.validate('').number(),
  amount: Validator.validate('').number(),
  receiveLimit: Validator.validate('').number(),
  target: Validator.validate('').enum(COUPON_TARGET),
  totalQuantity: Validator.validate('').number(),
  remainingQuantity: Validator.validate('').number(),
  status: Validator.validate('').enum(COUPON_STATUS),
  description: Validator.validate('').string().max(255),
  productIds: Validator.validate('').array('number'),
  startDate: Validator.validate('').string(),
  endDate: Validator.validate('').string(),
};
