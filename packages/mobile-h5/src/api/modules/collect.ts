/* eslint-disable */
import type { ORDER_DETAIL_TYPE } from '@/common/constant';
import { request } from '..';
import type { List } from '../helper/types';
import type { Product } from './product';
import type { Sets } from './sets';

export declare namespace Collect {
  interface Collect {
    id: number;
    targetType: ORDER_DETAIL_TYPE;
    targetId: number;
    userId: number;
  }

  type InsertParam = Pick<Collect, 'targetId' | 'targetType'>;

  type ResultWithTarget = Collect & { target: Product.Product | Sets.Sets };
}

/** 获取收藏列表 */
export async function getCollectList(pageParam: List.PageParam = {}) {
  return request<List.QueryResult<Collect.ResultWithTarget>>({
    url: '/collect',
    method: 'GET',
    params: {
      ...pageParam,
    },
  });
}

/** 添加收藏 */
export async function addCollect(data: Collect.InsertParam) {
  return request({
    url: '/collect',
    method: 'POST',
    data,
  });
}

/** 取消收藏 */
export async function cancelCollect(ids: number[]) {
  return request({
    url: '/collect',
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
