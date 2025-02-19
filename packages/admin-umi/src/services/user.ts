import { AjaxResult } from '@/requestErrorConfig';
import { List, User } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取用户信息 */
export async function getUserInfo(userId?: number) {
  return request<AjaxResult<User.DetailResult>>('/user/info', {
    method: 'GET',
    params: {
      userId,
    },
  });
}

/** 获取用户列表 */
export async function getUserList(
  listQueryParam: User.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<User.DetailResult>>>('/user', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增用户 */
export async function insertUser(data: User.InsertParam) {
  return request<AjaxResult>('/register', {
    method: 'POST',
    data,
  });
}

/** 更新用户信息 */
export async function updateUser(data: User.UpdateParam) {
  return request<AjaxResult>('/user', {
    method: 'PUT',
    data,
  });
}

/** 删除用户 */
export async function deleteUser(ids: number[]) {
  return request<AjaxResult>('/user', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}

/**检查手机号是否被注册 */
export async function checkTelNumber(telNumber: string) {
  return request<AjaxResult<{ hasRegister: boolean }>>('/register/check', {
    method: 'GET',
    params: {
      telNumber,
    },
  });
}
