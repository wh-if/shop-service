/* eslint-disable */
import { COUPON_TYPE, PRODUCT_STATUS } from '@/common/constant';
import { List, Product } from '.';

export declare namespace Sets {
  interface Sets {
    id: number;
    name: string;
    avatar: string;
    type: COUPON_TYPE;
    amount: number;
    description: string;
    categoryId: number;
    status: PRODUCT_STATUS;
    createTime: Date;
    updateTime: Date;
    products: Product.Product[];
  }

  type InsertParam = Pick<
    Sets,
    'avatar' | 'description' | 'name' | 'amount' | 'type' | 'categoryId' | 'status'
  > & { productIds: number[] };

  type UpdateParam = Pick<Sets, 'id'> & Partial<InsertParam>;

  type ListQueryParam = List.QueryParam<
    Sets,
    'id' | 'name' | 'type' | 'categoryId' | 'createTime' | 'updateTime' | 'status',
    'id' | 'createTime' | 'updateTime'
  >;
}
