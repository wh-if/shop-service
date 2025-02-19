/* eslint-disable */
import { COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import type { Product } from './product';
import type { List } from '../helper/types';
import { request } from '..';

export declare namespace Sets {
  interface Sets {
    id: number;
    name: string;
    avatar: string;
    type: COUPON_TYPE;
    amount: number;
    description: string;
    categoryId: number;
    status: PRODUCT_STATUS;
    createTime: Date;
    updateTime: Date;
    products: Product.Product[];
  }

  type ListQueryParam = List.QueryParam<
    Sets,
    'id' | 'name' | 'type' | 'categoryId' | 'createTime' | 'updateTime' | 'status',
    'id' | 'createTime' | 'updateTime'
  >;
}

/** 获取套装信息 */
export async function getSetsInfo(setsId?: number) {
  return request<Sets.Sets>({
    url: '/sets/' + setsId,
    method: 'GET',
  });
}

/** 获取套装列表 */
export async function getSetsList(
  listQueryParam: Sets.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<List.QueryResult<Sets.Sets>>({
    url: '/sets',
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
  });
}
