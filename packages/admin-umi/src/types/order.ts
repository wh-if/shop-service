/* eslint-disable */
import type { ORDER_DETAIL_TYPE, ORDER_STATUS, ORDER_TYPE, PAY_TYPE } from '@/common/constant';
import { List } from '.';

export declare namespace Order {
  interface Order {
    id: number;
    createTime: Date;
    payTime: Date;
    expectTime: Date; // 用户期望时间
    finishTime: Date; // 订单完成时间
    status: ORDER_STATUS; // 订单状态
    orderType: ORDER_TYPE; // 订单处理类型
    payAmount: number; // 订单支付金额
    amount: number; // 订单原始金额
    userId: number;
    note: string; // 备注
    payType: PAY_TYPE; // 支付方式
    couponIds: number[]; // 订单使用的优惠券
    items: OrderDetail[];
  }
  interface OrderDetail {
    id: number;
    type: ORDER_DETAIL_TYPE;
    targetId: number; // type为product就是productId，同理为setsId
    quantity: number; // 数量
    totalAmount: number; // 总价
    discountAmount: number; // 折扣价格，即结算价格
    chooseOption: number[]; // 单项的配置选项, type为product 就是product的option id，为sets就是sets包含的product的option id数组
    useCoupon: number;
  }

  type UpdateStatusParam = {
    ids: number[];
    status: ORDER_STATUS;
  };

  type PayParam = Pick<Order, 'id' | 'payType'> & { authcode: string };

  type InsertParam = Pick<Order, 'couponIds' | 'note' | 'orderType'> & {
    items: DetailInsertParam[];
    expectTime: string;
  };

  type DetailInsertParam = Pick<OrderDetail, 'quantity' | 'chooseOption' | 'targetId' | 'type'>;

  type ListQueryParam = List.QueryParam<
    Order,
    | 'id'
    | 'createTime'
    | 'finishTime'
    | 'payAmount'
    | 'orderType'
    | 'payType'
    | 'payTime'
    | 'status'
    | 'userId',
    'id' | 'createTime' | 'finishTime' | 'payTime' | 'payAmount'
  >;
}
