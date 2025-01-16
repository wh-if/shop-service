import { Injectable } from '@nestjs/common';
import { Product } from 'src/entity/product.entity';
import {
  ProductListQueryDTO,
  ProductInsertDTO,
  ProductUpdateDTO,
  ProductOptionInsertDTO,
  ProductOptionUpdateDTO,
} from 'src/dto/product.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { ProductOption } from 'src/entity/product_option.entity';

@Injectable()
export class ProductService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get productQBuilder(): SelectQueryBuilder<Product> {
    return this.dataSource.createQueryBuilder(Product, 'product');
  }

  async getProductList(query: ProductListQueryDTO, page: ListPageParam) {
    const subSqlBuilder = this.withPageOrderBuilder(this.productQBuilder, {
      page: page.page,
      pageSize: page.pageSize,
      order: query.order,
      orderBy: query.orderBy,
    });

    this.genWhereSql<Product, ProductListQueryDTO>(
      subSqlBuilder,
      'product',
      query,
      {
        stringType: ['id', 'name'],
        timeType: ['createTime', 'updateTime'],
        enumType: ['status', 'categoryId'],
        numberType: [],
      },
    );

    const [idList, total] = await subSqlBuilder
      .select('product.id')
      .getManyAndCount();

    const list = await this.productQBuilder
      .leftJoinAndSelect('product.options', 'product_option')
      .where(`product.id IN (:...ids)`, {
        ids: idList.map((p) => p.id),
      })
      .getMany();

    return {
      list,
      total,
    };
  }

  findProductById(id: number) {
    return this.productQBuilder
      .where({ id })
      .leftJoinAndSelect('product.options', 'product_option')
      .getOne();
  }

  insertProduct(dto: ProductInsertDTO) {
    return this.productQBuilder.insert().values(dto).execute();
  }

  updateProduct(dto: ProductUpdateDTO) {
    const { id, ...updateParams } = dto;
    return this.productQBuilder
      .update()
      .set(updateParams)
      .where({ id })
      .execute();
  }

  deleteProduct(ids: number[]) {
    return this.productQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }

  /**
   * 添加商品选项
   * @param dto
   * @returns
   */
  async insertProductOption(dto: ProductOptionInsertDTO) {
    const product = await this.findProductById(dto.productId);
    const newProductOption = new ProductOption(
      dto.name,
      dto.price,
      dto.originalPrice,
    );
    newProductOption.product = product;

    await this.dataSource.getRepository(ProductOption).save(newProductOption);

    return true;
  }

  /**
   * 修改商品选项信息
   * @param dto
   * @returns
   */
  updateProductOption(dto: ProductOptionUpdateDTO) {
    const { id, ...updateParams } = dto;
    return this.dataSource
      .createQueryBuilder(ProductOption, 'product_option')
      .update()
      .set(updateParams)
      .where({ id })
      .execute();
  }

  /**
   * 删除商品选项
   * @param poId
   * @returns
   */
  deleteProductOption(ids: number[]) {
    return this.dataSource
      .createQueryBuilder(ProductOption, 'product_option')
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
