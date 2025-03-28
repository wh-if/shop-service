import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import {
  UserInsertDTO,
  UserListQueryDTO,
  UserUpdateDTO,
} from 'src/dto/user.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Md5Hash } from 'src/common/util';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { USER_ROLE } from 'src/common/constant';

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

  async getUserList(query: UserListQueryDTO, page: ListPageParam) {
    if (query.ids) {
      const [list, total] = await this.userQBuilder
        .where('user.id IN (:...ids)', { ids: query.ids })
        .getManyAndCount();
      return {
        list,
        total,
      };
    }

    const sqlBuilder = this.withPageOrderBuilder(this.userQBuilder, {
      page: page.page,
      pageSize: page.pageSize,
      order: query.order,
      orderBy: query.orderBy,
    });

    this.genWhereSql<User, UserListQueryDTO>(sqlBuilder, 'user', query, {
      stringType: ['id', 'name', 'telNumber', 'roles'],
      timeType: ['createTime', 'lastLoginTime', 'updateTime'],
      enumType: ['status'],
      numberType: [],
    });

    const [list, total] = await sqlBuilder.getManyAndCount();

    list.forEach((item) => {
      delete item.password;
    });
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
  async findUserInfo(key: string | number) {
    const type = typeof key === 'number' ? 'id' : 'telNumber';
    const result = await this.userQBuilder.where({ [type]: key }).getOne();
    return result;
  }

  insert(dto: UserInsertDTO) {
    const user = new User();
    user.telNumber = dto.telNumber;
    user.password = Md5Hash(dto.password);
    user.name = dto.name;
    user.roles = [USER_ROLE.USER];

    return this.userQBuilder.insert().values(user).execute();
  }

  update(dto: UserUpdateDTO & { lastLoginTime?: Date }, id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authcode, ...updateParams } = dto;
    if (!!updateParams.password) {
      updateParams.password = Md5Hash(updateParams.password);
    }

    return this.userQBuilder.update().set(updateParams).where({ id }).execute();
  }

  delete(ids: number[]) {
    return this.userQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
