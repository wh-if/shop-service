import { Injectable } from '@nestjs/common';
import { Sets } from 'src/entity/sets.entity';
import {
  SetsListOrderDTO,
  SetsListQueryDTO,
  SetsInsertDTO,
  SetsUpdateDTO,
} from 'src/dto/sets.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { Product } from 'src/entity/product.entity';

@Injectable()
export class SetsService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get setsQBuilder(): SelectQueryBuilder<Sets> {
    return this.dataSource.createQueryBuilder(Sets, 'sets');
  }

  async getSetsList(
    query: SetsListQueryDTO,
    order: SetsListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.setsQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<Sets, SetsListQueryDTO>(sqlBuilder, 'sets', query, {
      stringType: ['id', 'name'],
      timeType: ['createDate', 'endDate', 'startDate'],
      enumType: [],
      numberType: ['price'],
    });

    const [list, total] = await sqlBuilder
      .leftJoinAndSelect('sets.products', 'product')
      .getManyAndCount();
    return {
      list,
      total,
    };
  }

  findSetsById(id: number) {
    return this.setsQBuilder
      .where({ id })
      .leftJoinAndSelect('sets.products', 'product')
      .getOne();
  }

  async insertSets(dto: SetsInsertDTO) {
    const sets = new Sets();
    sets.avatar = dto.avatar;
    sets.description = dto.description;
    sets.name = dto.name;
    sets.price = dto.price;
    sets.startDate = dto.startDate && new Date(parseInt(dto.startDate));
    sets.endDate = dto.endDate && new Date(parseInt(dto.endDate));
    sets.products = [];

    if (dto.productIds?.length > 0) {
      sets.products = await this.dataSource
        .createQueryBuilder(Product, 'product')
        .where('id IN (:...ids)', { ids: dto.productIds })
        .getMany();
    }

    await this.dataSource.getRepository(Sets).save(sets);

    return true;
  }

  async updateSets(dto: SetsUpdateDTO) {
    const { productIds, ...updateParams } = dto;

    let products: Product[];
    if (productIds?.length > 0) {
      products = await this.dataSource
        .createQueryBuilder(Product, 'product')
        .where('id IN (:...ids)', { ids: productIds })
        .getMany();
    } else if (productIds?.length === 0) {
      products = [];
    }

    const startDate =
      dto.startDate && new Date(parseInt(updateParams.startDate));
    const endDate = dto.endDate && new Date(parseInt(updateParams.endDate));

    await this.dataSource.getRepository(Sets).save({
      ...updateParams,
      startDate,
      endDate,
      products,
    });
    return true;
  }

  deleteSets(id: number) {
    return this.setsQBuilder.delete().where({ id }).execute();
  }
}
