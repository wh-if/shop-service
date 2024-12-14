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
