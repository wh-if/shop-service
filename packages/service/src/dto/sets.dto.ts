import { COUPON_TYPE, PRODUCT_STATUS } from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Sets } from 'src/entity/sets.entity';

export type SetsInsertDTO = Pick<
  Sets,
  | 'avatar'
  | 'description'
  | 'name'
  | 'amount'
  | 'type'
  | 'categoryId'
  | 'status'
> & { productIds: number[] };

export type SetsUpdateDTO = Pick<Sets, 'id'> & Partial<SetsInsertDTO>;

export type SetsListQueryDTO = ListQueryParam<
  Sets,
  'id' | 'name' | 'type' | 'categoryId' | 'createTime' | 'updateTime' | 'status'
>;

export const SetsValidator: Partial<
  Record<keyof Sets | 'productIds', Validator>
> = {
  type: Validator.validate('type').enum(COUPON_TYPE),
  amount: Validator.validate('amount').number(),
  status: Validator.validate('status').enum(PRODUCT_STATUS),
  description: Validator.validate('description').string().max(255),
  avatar: Validator.validate('avatar').string().max(255),
  name: Validator.validate('name').string().max(16),
  categoryId: Validator.validate('categoryId').number(),
  id: Validator.validate('id').number(),
  productIds: Validator.validate('productIds').array('number'),
};
