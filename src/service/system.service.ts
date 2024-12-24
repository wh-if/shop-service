import { Injectable } from '@nestjs/common';
import { Configuration } from 'src/entity/configuration.entity';
import {
  ConfigurationInsertDTO,
  ConfigurationListOrderDTO,
  ConfigurationListQueryDTO,
  ConfigurationUpdateDTO,
} from 'src/dto/system.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class SystemService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  /**
   * 每次读都获取一个新的sql构造器
   */
  public get configQBuilder(): SelectQueryBuilder<Configuration> {
    return this.dataSource.createQueryBuilder(Configuration, 'configuration');
  }

  async getConfigList(
    query: ConfigurationListQueryDTO,
    order: ConfigurationListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.configQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    if (!!query.id) {
      sqlBuilder.andWhere('configuration.id LIKE :id', { id: `%${query.id}%` });
    }
    if (!!query.key) {
      sqlBuilder.andWhere('configuration.key LIKE :key', {
        key: `%${query.key}%`,
      });
    }

    this.genWhereSql<Configuration, ConfigurationListQueryDTO>(
      sqlBuilder,
      'configuration',
      query,
      {
        stringType: ['id', 'key'],
        timeType: [],
        enumType: [],
        numberType: [],
      },
    );

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findConfigByKey(key: string) {
    return this.configQBuilder.where({ key }).getOne();
  }

  insertConfig(dto: ConfigurationInsertDTO) {
    const configuration = new Configuration(dto.key, dto.value);
    return this.configQBuilder.insert().values(configuration).execute();
  }

  updateConfig(dto: ConfigurationUpdateDTO) {
    return this.configQBuilder
      .update()
      .set({ value: dto.value })
      .where({ id: dto.id })
      .execute();
  }

  deleteConfig(id: number) {
    return this.configQBuilder.delete().where({ id }).execute();
  }
}
