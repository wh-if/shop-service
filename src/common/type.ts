import { USER_ROLE } from './constant';

export interface ExpressReqWithUser extends Express.Request {
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
  Record<G, string | string[] | number[]> & {
    orderBy: G;
    order: 'DESC' | 'ASC';
  }
>;
