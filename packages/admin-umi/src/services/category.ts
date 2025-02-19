import { AjaxResult } from '@/requestErrorConfig';
import { List, Category } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取类别信息 */
export async function getCategoryInfo(categoryId?: number) {
  return request<AjaxResult<Category.Category>>('/category/' + categoryId, {
    method: 'GET',
  });
}

/** 获取类别列表 */
export async function getCategoryList(
  listQueryParam: Category.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Category.Category>>>('/category', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增类别 */
export async function insertCategory(data: Category.InsertParam) {
  return request<AjaxResult>('/category', {
    method: 'POST',
    data,
  });
}

/** 更新类别信息 */
export async function updateCategory(data: Category.UpdateParam) {
  return request<AjaxResult>('/category', {
    method: 'PUT',
    data,
  });
}

/** 删除类别 */
export async function deleteCategory(ids: number[]) {
  return request<AjaxResult>('/category', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
