import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import {
  UserInsertDTO,
  UserListOrderDTO,
  UserListQueryDTO,
  UserUpdateDTO,
} from 'src/dto/user.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Md5Hash } from 'src/common/util';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  /**
   * 每次读都获取一个新的sql构造器
   */
  public get userQBuilder(): SelectQueryBuilder<User> {
    return this.dataSource.createQueryBuilder(User, 'user');
  }

  async getUserList(
    query: UserListQueryDTO,
    order: UserListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.userQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<User, UserListQueryDTO>(sqlBuilder, 'user', query, {
      stringType: ['id', 'name', 'telNumber'],
      timeType: ['createTime', 'lastLoginTime', 'updateTime'],
      enumType: ['role', 'status'],
      numberType: [],
    });

    const [list, total] = await sqlBuilder.getManyAndCount();
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
