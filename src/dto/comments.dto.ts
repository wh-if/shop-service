import { ListQueryParam } from 'src/common/type';
import { Comments } from 'src/entity/comments.entity';

export type CommentsUpdateDTO = Pick<
  Comments,
  'id' | 'content' | 'pictures' | 'star' | 'status'
>;

export type CommentsInsertDTO = Pick<
  Comments,
  'content' | 'pictures' | 'star' | 'orderId' | 'parentId'
>;

export type CommentsListQueryDTO = ListQueryParam<
  Comments,
  | 'id'
  | 'orderId'
  | 'userId'
  | 'parentId'
  | 'createTime'
  | 'updateTime'
  | 'star'
  | 'status'
>;
