/* eslint-disable */
import { COMMENTS_STATUS } from '@/common/constant';
import { List } from '.';

export declare namespace Comments {
  interface Comments {
    id: number;
    userId: number;
    orderId: number;
    star: number;
    parentId: number;
    createTime: string;
    updateTime: string;
    pictures: string[];
    content: string;
    status: COMMENTS_STATUS;
  }

  type InsertParam = Pick<Comments, 'content' | 'pictures' | 'star' | 'orderId' | 'parentId'>;

  type UpdateParam = Pick<Comments, 'id'> &
    Partial<Pick<Comments, 'content' | 'pictures' | 'star' | 'status'>>;

  type UpdateStatusParam = {
    ids: number[];
    status: COMMENTS_STATUS;
  };

  type ListQueryParam = List.QueryParam<
    Comments,
    'id' | 'orderId' | 'userId' | 'parentId' | 'createTime' | 'updateTime' | 'star' | 'status',
    'id' | 'createTime' | 'updateTime'
  >;
}
