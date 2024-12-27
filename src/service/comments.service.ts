import { Injectable } from '@nestjs/common';
import { Comments } from 'src/entity/comments.entity';
import {
  CommentsListQueryDTO,
  CommentsInsertDTO,
  CommentsUpdateDTO,
} from 'src/dto/comments.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class CommentsService extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get commentsQBuilder(): SelectQueryBuilder<Comments> {
    return this.dataSource.createQueryBuilder(Comments, 'comments');
  }

  async getCommentsList(query: CommentsListQueryDTO, page: ListPageParam) {
    const sqlBuilder = this.commentsQBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize);
    if (query.orderBy && query.order) {
      sqlBuilder.orderBy({ [query.orderBy]: query.order });
    }

    this.genWhereSql<Comments, CommentsListQueryDTO>(
      sqlBuilder,
      'comments',
      query,
      {
        stringType: ['id'],
        timeType: ['createTime', 'updateTime'],
        enumType: ['status', 'parentId', 'orderId', 'userId'],
        numberType: ['star'],
      },
    );

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  findCommentsById(id: number) {
    return this.commentsQBuilder.where({ id }).getOne();
  }

  insertComments(dto: CommentsInsertDTO, userId: number) {
    return this.commentsQBuilder
      .insert()
      .values({ ...dto, userId })
      .execute();
  }

  updateComments(dto: CommentsUpdateDTO) {
    const { id, ...updateParams } = dto;
    return this.commentsQBuilder
      .update()
      .set(updateParams)
      .where({ id })
      .execute();
  }

  deleteComments(ids: number[]) {
    return this.commentsQBuilder
      .delete()
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
