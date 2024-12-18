import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import {
  ProductListOrderDTO,
  ProductListQueryDTO,
  ProductInsertDTO,
  ProductUpdateDTO,
} from 'src/dto/product.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class ProductService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get productQBuilder(): SelectQueryBuilder<Product> {
    return this.dataSource.createQueryBuilder(Product, 'product');
  }

  async getProductList(
    query: ProductListQueryDTO,
    order: ProductListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.productQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<Product, ProductListQueryDTO>(
      sqlBuilder,
      'product',
      query,
      {
        stringType: ['id', 'name'],
        timeType: ['createTime', 'updateTime'],
        enumType: ['status'],
        numberType: ['price', 'stockQuantity', 'originalPrice'],
      },
    );

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findProductById(id: number) {
    return this.productQBuilder.where({ id }).getOne();
  }

  insertProduct(dto: ProductInsertDTO) {
    const product = new Product();
    product.name = dto.name;
    product.avatar = dto.avatar;
    product.description = dto.description;
    product.options = dto.options;
    product.price = dto.price;
    product.originalPrice = dto.originalPrice;
    product.pictures = dto.pictures;
    product.stockQuantity = dto.stockQuantity;
    product.status = dto.status;
    return this.productQBuilder.insert().values(product).execute();
  }

  updateProduct(dto: ProductUpdateDTO) {
    const { id, ...updateParams } = dto;
    return this.productQBuilder
      .update()
      .set(updateParams)
      .where({ id })
      .execute();
  }

  deleteProduct(id: number) {
    return this.productQBuilder.delete().where({ id }).execute();
  }
}
