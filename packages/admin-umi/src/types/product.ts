/* eslint-disable */
import type { PRODUCT_STATUS } from '@/common/constant';
import { List } from '.';

export declare namespace Product {
  interface Product {
    id: number;
    name: string;
    categoryId: number;
    description: string;
    avatar: string;
    pictures: string[];
    createTime: Date;
    updateTime: Date;
    status: PRODUCT_STATUS;
    options: ProductOption[];
  }
  interface ProductOption {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
  }
  type InsertParam = Pick<
    Product,
    'name' | 'avatar' | 'categoryId' | 'description' | 'pictures' | 'status'
  >;
  type UpdateParam = Pick<Product, 'id'> & Partial<InsertParam>;

  type OptionInsertParam = Pick<ProductOption, 'name' | 'originalPrice' | 'price'> & {
    productId: number;
  };

  type OptionUpdateParam = Pick<ProductOption, 'id'> & Partial<Omit<ProductOption, 'id'>>;

  type ListQueryParam = List.QueryParam<
    Product,
    'id' | 'name' | 'categoryId' | 'status' | 'createTime' | 'updateTime',
    'id' | 'createTime' | 'updateTime'
  >;
}
