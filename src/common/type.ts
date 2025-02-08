import { USER_ROLE } from './constant';

export enum PLATFORM_TYPE {
  MOBILE_H5 = 'MOBILE_H5',
  ADMIN = 'ADMIN',
}

export interface ExpressReqWithUser extends Express.Request {
  headers: {
    platform: PLATFORM_TYPE;
  };
  userInfo: TokenPayload;
}

export interface TokenPayload {
  userId: number;
  telNumber: string;
  roles: USER_ROLE[];
  iat: number;
  exp: number;
}

export interface ListPageParam {
  page: number;
  pageSize: number;
}

export type ListQueryParam<T, G extends keyof T> = Partial<
  Record<G, string | number | string[] | number[]> & {
    ids: number[];
    orderBy: G;
    order: 'DESC' | 'ASC';
  }
>;
