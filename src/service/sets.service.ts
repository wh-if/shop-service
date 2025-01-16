import { Injectable } from '@nestjs/common';
import { Sets } from 'src/entity/sets.entity';
import {
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

  async getSetsList(query: SetsListQueryDTO, page: ListPageParam) {
    if (query.ids) {
      const [list, total] = await this.setsQBuilder
        .leftJoinAndSelect('sets.products', 'product')
        .leftJoinAndSelect('product.options', 'product_option')
        .where('sets.id IN (:...ids)', { ids: query.ids })
        .getManyAndCount();
      return {
        list,
        total,
      };
    }

    const subSqlBuilder = this.withPageOrderBuilder(this.setsQBuilder, {
      page: page.page,
      pageSize: page.pageSize,
      order: query.order,
      orderBy: query.orderBy,
    });

    this.genWhereSql<Sets, SetsListQueryDTO>(subSqlBuilder, 'sets', query, {
      stringType: ['id', 'name'],
      timeType: ['createTime', 'updateTime'],
      enumType: ['type', 'categoryId', 'status'],
      numberType: [],
    });

    const [idList, total] = await subSqlBuilder
      .select('sets.id')
      .getManyAndCount();
    if (idList.length === 0) {
      return {
        list: [],
        total: 0,
      };
    }

    const list = await this.setsQBuilder
      .leftJoinAndSelect('sets.products', 'product')
      .leftJoinAndSelect('product.options', 'product_option')
      .where(`sets.id IN (:...ids)`, {
        ids: idList.map((s) => s.id),
      })
      .getMany();

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
    sets.type = dto.type;
    sets.status = dto.status;
    sets.amount = dto.amount;
    sets.categoryId = dto.categoryId;
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

    await this.dataSource.getRepository(Sets).save({
      ...updateParams,
      products,
    });
    return true;
  }

  deleteSets(ids: number[]) {
    return this.setsQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
