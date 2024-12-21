import { USER_ROLE } from './constant';

export interface ExpressReqWithUser extends Express.Request {
  userInfo: UserInfoOfRequest;
}

export interface UserInfoOfRequest {
  userId: number;
  telNumber: string;
  roles: USER_ROLE[];
}

export interface ListPageParam {
  page: number;
  pageSize: number;
}

export type ListOrderType<T, G extends keyof T> = Partial<
  Record<G, 'DESC' | 'ASC'>
>;

export type ListQueryParam<T, G extends keyof T> = Partial<
  Record<G, string | string[] | number[]>
>;
