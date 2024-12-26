import { USER_ROLE, USER_STATUS } from 'src/common/constant';
import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { User } from 'src/entity/user.entity';

export type UserUpdateDTO = Partial<
  Omit<User, 'createTime' | 'updateTime' | 'lastLoginTime' | 'collects'> & {
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

export const UserValidator: Partial<
  Record<keyof User | 'authcode', Validator>
> = {
  avatar: Validator.validate('avatar').string().max(255),
  password: Validator.validate('password').string().max(255),
  telNumber: Validator.validate('telNumber').string().exact(11),
  authcode: Validator.validate('authcode').string().exact(6),
  name: Validator.validate('name').string().max(16),
  id: Validator.validate('id').number(),
  status: Validator.validate('status').enum(USER_STATUS),
  roles: Validator.validate('roles').enum([USER_ROLE]),
};
