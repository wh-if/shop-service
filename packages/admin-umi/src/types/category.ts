/* eslint-disable */
import { List } from '.';

export declare namespace Category {
  interface Category {
    id: number;
    name: string;
    avatar: string;
    parentId: number;
  }
  type InsertParam = Pick<Category, 'name'> & Partial<Pick<Category, 'avatar' | 'parentId'>>;
  type UpdateParam = Pick<Category, 'id'> & Partial<Omit<Category, 'id'>>;

  type ListQueryParam = List.QueryParam<Category, 'id' | 'name' | 'parentId', 'id'>;
}
