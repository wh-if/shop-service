import { Injectable } from '@nestjs/common';
import { Configuration } from 'src/entity/configuration.entity';
import {
  ConfigurationInsertDTO,
  ConfigurationUpdateDTO,
} from 'src/dto/system.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SystemService {
  configQBuilder: SelectQueryBuilder<Configuration>;
  constructor(dataSource: DataSource) {
    this.configQBuilder = dataSource.createQueryBuilder(
      Configuration,
      'configuration',
    );
  }

  async getList(page: number, pageSize: number) {
    const list = await this.configQBuilder
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();

    const total = await this.configQBuilder.getCount();
    return {
      list,
      total,
    };
  }

  findByKey(key: string) {
    return this.configQBuilder.where({ key }).getOne();
  }

  insert(dto: ConfigurationInsertDTO) {
    const configuration = new Configuration(dto.key, dto.value);
    return this.configQBuilder.insert().values(configuration).execute();
  }

  update(dto: ConfigurationUpdateDTO) {
    return this.configQBuilder
      .update()
      .set({ value: dto.value })
      .where({ id: dto.id })
      .execute();
  }

  delete(id: number) {
    return this.configQBuilder.delete().where({ id }).execute();
  }
}
