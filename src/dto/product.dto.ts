import { ListOrderType, ListQueryParam } from 'src/common/type';
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

export type ProductListOrderDTO = ListOrderType<
  Product,
  'id' | 'createTime' | 'updateTime'
>;

export type ProductOptionInsertDTO = Pick<
  ProductOption,
  'name' | 'originalPrice' | 'price'
> & { productId: number };

export type ProductOptionUpdateDTO = Pick<
  ProductOption,
  'id' | 'name' | 'originalPrice' | 'price'
>;
