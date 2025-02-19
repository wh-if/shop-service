import { COMMENTS_STATUS, ORDER_DETAIL_TYPE } from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Comments } from 'src/entity/comments.entity';

export type CommentsUpdateDTO = Pick<
  Comments,
  'id' | 'content' | 'pictures' | 'star'
>;

export type CommentsInsertDTO = Pick<
  Comments,
  'content' | 'pictures' | 'star' | 'targetId' | 'targetType' | 'parentId'
>;

export type CommentsUpdateStatusDTO = {
  ids: number[];
  status: COMMENTS_STATUS;
};

export type CommentsListQueryDTO = ListQueryParam<
  Comments,
  | 'id'
  | 'targetId'
  | 'targetType'
  | 'userId'
  | 'parentId'
  | 'createTime'
  | 'updateTime'
  | 'star'
  | 'status'
>;

export const CommentsValidator: Partial<
  Record<keyof Comments | 'ids', Validator>
> = {
  id: Validator.validate('id').number(),
  userId: Validator.validate('userId').number(),
  targetId: Validator.validate('targetId').number(),
  targetType: Validator.validate('targetType').enum(ORDER_DETAIL_TYPE),
  parentId: Validator.validate('parentId').number(),
  star: Validator.validate('star').number().min(0.5).max(5),
  pictures: Validator.validate('pictures').array('string'),
  content: Validator.validate('content').string(),
  status: Validator.validate('status').enum(COMMENTS_STATUS),
  ids: Validator.validate('ids').array('number'),
};
