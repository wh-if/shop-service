import { AjaxResult } from '@/requestErrorConfig';
import { List, Sets } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取套装信息 */
export async function getSetsInfo(setsId?: number) {
  return request<AjaxResult<Sets.Sets>>('/sets/' + setsId, {
    method: 'GET',
  });
}

/** 获取套装列表 */
export async function getSetsList(
  listQueryParam: Sets.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Sets.Sets>>>('/sets', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增套装 */
export async function insertSets(data: Sets.InsertParam) {
  return request<AjaxResult>('/sets', {
    method: 'POST',
    data,
  });
}

/** 更新套装信息 */
export async function updateSets(data: Sets.UpdateParam) {
  return request<AjaxResult>('/sets', {
    method: 'PUT',
    data,
  });
}

/** 删除套装 */
export async function deleteSets(ids: number[]) {
  return request<AjaxResult>('/sets', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
