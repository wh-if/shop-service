/* eslint-disable */
import { User } from '.';

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
