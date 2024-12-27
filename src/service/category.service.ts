import { Injectable } from '@nestjs/common';
import { Category } from 'src/entity/category.entity';
import {
  CategoryListOrderDTO,
  CategoryListQueryDTO,
  CategoryInsertDTO,
  CategoryUpdateDTO,
} from 'src/dto/category.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class CategoryService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get categoryQBuilder(): SelectQueryBuilder<Category> {
    return this.dataSource.createQueryBuilder(Category, 'category');
  }

  async getCategoryList(
    query: CategoryListQueryDTO,
    order: CategoryListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.categoryQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<Category, CategoryListQueryDTO>(
      sqlBuilder,
      'category',
      query,
      {
        stringType: ['id', 'name'],
        timeType: [],
        enumType: ['parentId'],
        numberType: [],
      },
    );

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findCategoryById(id: number) {
    return this.categoryQBuilder.where({ id }).getOne();
  }

  insertCategory(dto: CategoryInsertDTO) {
    const category = new Category();
    category.avatar = dto.avatar;
    category.name = dto.name;
    category.parentId = dto.parentId;
    return this.categoryQBuilder.insert().values(category).execute();
  }

  updateCategory(dto: CategoryUpdateDTO) {
    const { id, ...updateParams } = dto;
    return this.categoryQBuilder
      .update()
      .set(updateParams)
      .where({ id })
      .execute();
  }

  deleteCategory(ids: number[]) {
    return this.categoryQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
