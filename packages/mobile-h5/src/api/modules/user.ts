/* eslint-disable */

import type { USER_ROLE, USER_STATUS } from '@/common/constant';
import type { AjaxResult } from '../helper/types';
import { request } from '..';

export declare namespace User {
  interface User {
    id: number;
    name: string;
    telNumber: string;
    avatar: string;
    password: string;
    status: USER_STATUS;
    roles: USER_ROLE[];
    createTime: Date;
    updateTime: Date;
    lastLoginTime: Date;
  }
  type DetailResult = Omit<User, 'password'>;
  type InsertParam = Pick<User, 'name' | 'password' | 'telNumber'> & { authcode: string };
  type UpdateParam = Partial<
    Pick<User, 'id' | 'name' | 'avatar' | 'telNumber' | 'password' | 'roles' | 'status'> & {
      authcode: string;
    }
  >;
}

/** 获取用户信息 */
export async function getUserInfo(userId?: number) {
  return request<AjaxResult<User.DetailResult>>({
    url: '/user/info',
    method: 'GET',
    params: {
      userId,
    },
  });
}

/** 新增用户 */
export async function insertUser(data: User.InsertParam) {
  return request({
    url: '/register',
    method: 'POST',
    data,
  });
}

/** 更新用户信息 */
export async function updateUser(data: User.UpdateParam) {
  return request({
    url: '/user',
    method: 'PUT',
    data,
  });
}

/** 删除用户 */
export async function deleteUser(ids: number[]) {
  return request({
    url: '/user',
    method: 'DELETE',
    params: {
      ids,
    },
  });
}

/**检查手机号是否被注册 */
export async function checkTelNumber(telNumber: string) {
  return request<{ hasRegister: boolean }>({
    url: '/register/check',
    method: 'GET',
    params: {
      telNumber,
    },
  });
}
