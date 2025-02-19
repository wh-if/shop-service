/* eslint-disable */
import { request } from '..';
import type { List } from '../helper/types';

export declare namespace Category {
  interface Category {
    id: number;
    name: string;
    avatar: string;
    parentId: number;
  }

  type ListQueryParam = List.QueryParam<Category, 'id' | 'name' | 'parentId', 'id'>;
}

/** 获取类别列表 */
export async function getCategoryList(
  listQueryParam: Category.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<List.QueryResult<Category.Category>>({
    url: '/category',
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
  });
}
