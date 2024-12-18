import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Product } from 'src/entity/product.entity';

export type ProductUpdateDTO = Pick<
  Product,
  | 'id'
  | 'avatar'
  | 'description'
  | 'name'
  | 'options'
  | 'originalPrice'
  | 'pictures'
  | 'price'
  | 'status'
  | 'stockQuantity'
>;

export type ProductInsertDTO = Pick<
  Product,
  | 'name'
  | 'avatar'
  | 'description'
  | 'options'
  | 'originalPrice'
  | 'pictures'
  | 'price'
  | 'status'
  | 'stockQuantity'
>;

export type ProductListQueryDTO = ListQueryParam<
  Product,
  | 'id'
  | 'name'
  | 'price'
  | 'originalPrice'
  | 'status'
  | 'stockQuantity'
  | 'createTime'
  | 'updateTime'
>;

export type ProductListOrderDTO = ListOrderType<
  Product,
  | 'id'
  | 'createTime'
  | 'updateTime'
  | 'originalPrice'
  | 'price'
  | 'stockQuantity'
>;
