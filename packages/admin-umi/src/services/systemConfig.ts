import { AjaxResult } from '@/requestErrorConfig';
import { List, SystemConfig } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取系统配置信息 */
export async function getSystemConfigInfo(configKey: string) {
  return request<AjaxResult<SystemConfig.SystemConfig>>('/system/config/' + configKey, {
    method: 'GET',
  });
}

/** 获取系统配置列表 */
export async function getSystemConfigList(
  listQueryParam: SystemConfig.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<SystemConfig.SystemConfig>>>('/system/config', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增系统配置 */
export async function insertSystemConfig(data: SystemConfig.InsertParam) {
  return request<AjaxResult>('/system/config', {
    method: 'POST',
    data,
  });
}

/** 更新系统配置信息 */
export async function updateSystemConfig(data: SystemConfig.UpdateParam) {
  return request<AjaxResult>('/system/config', {
    method: 'PUT',
    data,
  });
}

/** 删除系统配置 */
export async function deleteSystemConfig(ids: number[]) {
  return request<AjaxResult>('/system/config', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
