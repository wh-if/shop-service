import { Injectable } from '@nestjs/common';
import { Configuration } from 'src/entity/configuration.entity';
import {
  ConfigurationInsertDTO,
  ConfigurationUpdateDTO,
} from 'src/dto/system.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(private dataSource: DataSource) {}

  async getList(page: number, pageSize: number) {
    const list = await this.dataSource
      .createQueryBuilder(Configuration, 'configuration')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();

    const total = await this.dataSource.getRepository(Configuration).count();
    return {
      list,
      total,
    };
  }

  findByKey(key: string) {
    return this.dataSource
      .getRepository(Configuration)
      .findOne({ where: { key } });
  }

  insert(dto: ConfigurationInsertDTO) {
    const configuration = new Configuration(dto.key, dto.value);
    return this.dataSource
      .createEntityManager()
      .insert(Configuration, configuration);
  }

  update(dto: ConfigurationUpdateDTO) {
    return this.dataSource.getRepository(Configuration).update(
      {
        id: dto.id,
      },
      {
        value: dto.value,
      },
    );
  }
}
