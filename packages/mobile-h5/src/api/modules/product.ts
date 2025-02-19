/* eslint-disable */
import type { PRODUCT_STATUS } from '@/common/constant';
import type { List } from '../helper/types';
import { request } from '..';

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

  type ListQueryParam = List.QueryParam<
    Product,
    'id' | 'name' | 'categoryId' | 'status' | 'createTime' | 'updateTime',
    'id' | 'createTime' | 'updateTime'
  >;
}

/** 获取产品信息 */
export async function getProductInfo(productId?: number) {
  return request<Product.Product>({
    url: '/product/' + productId,
    method: 'GET',
  });
}

/** 获取产品列表 */
export async function getProductList(
  listQueryParam: Product.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<List.QueryResult<Product.Product>>({
    url: '/product',
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
  });
}
