import { PRODUCT_STATUS } from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Product } from 'src/entity/product.entity';
import { ProductOption } from 'src/entity/product_option.entity';

export type ProductUpdateDTO = Pick<
  Product,
  | 'id'
  | 'avatar'
  | 'description'
  | 'categoryId'
  | 'name'
  | 'pictures'
  | 'status'
>;

export type ProductInsertDTO = Pick<
  Product,
  'name' | 'avatar' | 'categoryId' | 'description' | 'pictures' | 'status'
>;

export type ProductListQueryDTO = ListQueryParam<
  Product,
  'id' | 'name' | 'categoryId' | 'status' | 'createTime' | 'updateTime'
>;

export type ProductOptionInsertDTO = Pick<
  ProductOption,
  'name' | 'originalPrice' | 'price'
> & { productId: number };

export type ProductOptionUpdateDTO = Pick<
  ProductOption,
  'id' | 'name' | 'originalPrice' | 'price'
>;

export const ProductValidator: Partial<Record<keyof Product, Validator>> = {
  avatar: Validator.validate('avatar').string().max(255),
  description: Validator.validate('description').string().max(255),
  pictures: Validator.validate('pictures').array('string'),
  status: Validator.validate('status').enum(PRODUCT_STATUS),
  categoryId: Validator.validate('categoryId').number(),
  name: Validator.validate('name').string().max(32),
  id: Validator.validate('id').number(),
};

export const ProductOptionValidator: Partial<
  Record<keyof ProductOption | 'productId', Validator>
> = {
  price: Validator.validate('price').number(),
  originalPrice: Validator.validate('originalPrice').number(),
  name: Validator.validate('name').string().max(16),
  id: Validator.validate('id').number(),
  productId: Validator.validate('productId').number(),
};
