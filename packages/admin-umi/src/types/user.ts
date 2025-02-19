/* eslint-disable */
import type { USER_ROLE, USER_STATUS } from '@/common/constant';
import { List } from '.';

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
  type ListQueryParam = List.QueryParam<
    User,
    | 'id'
    | 'createTime'
    | 'lastLoginTime'
    | 'name'
    | 'roles'
    | 'status'
    | 'telNumber'
    | 'updateTime',
    'id' | 'createTime' | 'lastLoginTime' | 'updateTime'
  >;
}
