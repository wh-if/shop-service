import { ListOrderType, ListQueryParam } from 'src/common/type';
import { User } from 'src/entity/user.entity';

export type UserUpdateDTO = Partial<
  Omit<User, 'id' | 'createTime' | 'updateTime' | 'lastLoginTime'> & {
    authcode: string;
  }
>;

export interface UserInsertDTO {
  name: string;
  password: string;
  telNumber: string;
  authcode: string;
}

export type LoginDTO = Partial<Omit<UserInsertDTO, 'name'>>;

export type UserListQueryDTO = ListQueryParam<
  User,
  | 'id'
  | 'createTime'
  | 'lastLoginTime'
  | 'name'
  | 'roles'
  | 'status'
  | 'telNumber'
  | 'updateTime'
>;

export type UserListOrderDTO = ListOrderType<
  User,
  'id' | 'createTime' | 'lastLoginTime' | 'updateTime'
>;
