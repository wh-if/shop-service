/* eslint-disable */

import { request } from '..';
import type { User } from './user';

export declare namespace Auth {
  type CodeResult = {
    code: string;
  };

  type LoginParams = {
    telNumber: string;
    password?: string;
    authcode?: string;
  };

  type LoginResult = {
    access_token: string;
    refresh_token: string;
    userInfo: User.DetailResult;
  };

  type TokenRefreshResult = Pick<LoginResult, 'access_token' | 'refresh_token'>;
}

/** 获取验证码 */
export async function getAuthCode(telNumber?: string) {
  return request<Auth.CodeResult>({
    url: '/auth/code',
    method: 'GET',
    params: {
      telNumber,
    },
  });
}

/** 登录 */
export async function login(body: Auth.LoginParams) {
  return request<Auth.LoginResult>({
    url: '/auth/login',
    method: 'POST',
    data: body,
  });
}

/** 刷新token */
export async function refreshToken() {
  return request<Auth.TokenRefreshResult>({
    url: '/auth/token',
    method: 'GET',
  });
}
