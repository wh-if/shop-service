import { COUPON_TYPE } from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Sets } from 'src/entity/sets.entity';

export type SetsUpdateDTO = Pick<
  Sets,
  'id' | 'avatar' | 'description' | 'name' | 'amount' | 'type' | 'categoryId'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsInsertDTO = Pick<
  Sets,
  'avatar' | 'description' | 'name' | 'amount' | 'type' | 'categoryId'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsListQueryDTO = ListQueryParam<
  Sets,
  'id' | 'endDate' | 'name' | 'type' | 'startDate' | 'createDate' | 'categoryId'
>;

export const SetsValidator: Partial<
  Record<keyof Sets | 'productIds', Validator>
> = {
  type: Validator.validate('type').enum(COUPON_TYPE),
  amount: Validator.validate('amount').number(),
  startDate: Validator.validate('startDate').string(),
  endDate: Validator.validate('endDate').string(),
  description: Validator.validate('description').string().max(255),
  avatar: Validator.validate('avatar').string().max(255),
  name: Validator.validate('name').string().max(16),
  categoryId: Validator.validate('categoryId').number(),
  id: Validator.validate('id').number(),
  productIds: Validator.validate('productIds').array('number'),
};
