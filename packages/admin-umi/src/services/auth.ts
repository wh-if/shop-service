import { AjaxResult } from '@/requestErrorConfig';
import { request } from '@umijs/max';
import { Auth } from '../types';

/** 获取验证码 */
export async function getAuthCode(telNumber: string) {
  return request<AjaxResult<Auth.CodeResult>>('/auth/code', {
    method: 'GET',
    params: {
      telNumber,
    },
  });
}

/** 登录 */
export async function login(body: Auth.LoginParams) {
  return request<AjaxResult<Auth.LoginResult>>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 刷新token */
export async function refreshToken() {
  return request<AjaxResult<Auth.TokenRefreshResult>>('/auth/token', {
    method: 'GET',
  });
}
