import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserInsertDTO, UserUpdateDTO } from 'src/dto/user.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Md5Hash } from 'src/common/util';

@Injectable()
export class UserService {
  userQBuilder: SelectQueryBuilder<User>;
  constructor(dataSource: DataSource) {
    this.userQBuilder = dataSource.createQueryBuilder(User, 'user');
  }

  async getList(page: number, pageSize: number) {
    const list = await this.userQBuilder
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();

    const total = await this.userQBuilder.getCount();
    return {
      list,
      total,
    };
  }

  /**
   * 根据id或手机号获取用户信息
   * @param key
   * @param type
   * @returns
   */
  async findUserInfo(key: string, type: 'id' | 'telNumber') {
    const result = await this.userQBuilder.where({ [type]: key }).getOne();
    return result;
  }

  insert(dto: UserInsertDTO) {
    const user = new User();
    user.telNumber = dto.telNumber;
    user.password = Md5Hash(dto.password);
    user.name = dto.name;

    return this.userQBuilder.insert().values(user).execute();
  }

  update(dto: UserUpdateDTO & { lastLoginTime?: Date }, id: number) {
    const { authcode, ...updateParams } = dto;
    if (!!updateParams.password) {
      updateParams.password = Md5Hash(updateParams.password);
    }

    return this.userQBuilder.update().set(updateParams).where({ id }).execute();
  }

  delete(id: number) {
    return this.userQBuilder.delete().where({ id }).execute();
  }
}
