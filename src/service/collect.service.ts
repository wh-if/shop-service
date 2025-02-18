import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Collect } from 'src/entity/collect.entity';
import { CollectInsertDTO } from 'src/dto/collect.dto';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';
import { ORDER_DETAIL_TYPE } from 'src/common/constant';
import { OrderService } from '.';

@Injectable()
export class CollectService extends BaseService {
  constructor(
    private dataSource: DataSource,
    private orderService: OrderService,
  ) {
    super();
  }

  public get collectQBuilder(): SelectQueryBuilder<Collect> {
    return this.dataSource.createQueryBuilder(Collect, 'collect');
  }

  // 获取收藏列表
  async getCollectList(userId: number, page: ListPageParam) {
    const sqlBuilder = this.withPageOrderBuilder(this.collectQBuilder, {
      ...page,
    });

    const [list, total] = await sqlBuilder
      .where('userId = :userId', { userId })
      .getManyAndCount();

    const collects = await this.orderService.withTargetData(list);

    return { list: collects, total };
  }

  // 添加收藏
  async addCollect(userId: number, target: CollectInsertDTO) {
    const result = await this.collectQBuilder
      .insert()
      .values({
        userId,
        ...target,
      })
      .execute();

    return result;
  }

  // 取消收藏
  async cancelCollect(ids: number[]) {
    const result = await this.collectQBuilder
      .delete()
      .whereInIds(ids)
      .execute();
    return result;
  }

  // 目标的收藏量
  getTargetCollectCount(targetId: number, targetType: ORDER_DETAIL_TYPE) {
    const count = this.collectQBuilder
      .where('targetId = :targetId AND targetType = :targetType', {
        targetId,
        targetType,
      })
      .getCount();
    return count;
  }
}
