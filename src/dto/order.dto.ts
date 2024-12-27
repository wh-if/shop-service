import { ListQueryParam } from 'src/common/type';
import { Order } from 'src/entity/order.entity';
import { OrderDetail } from 'src/entity/order_detail.entity';

export type OrderStatusChangeDTO = Pick<Order, 'id' | 'status'>;

export type OrderPayDTO = Pick<Order, 'id' | 'payType'> & { authcode: string };

export type OrderInsertDTO = Pick<Order, 'couponIds' | 'note' | 'orderType'> & {
  items: OrderDetailInsertDTO[];
  expectTime: string;
};

export type OrderDetailInsertDTO = Pick<
  OrderDetail,
  'quantity' | 'chooseOption' | 'targetId' | 'type'
>;

export type OrderListQueryDTO = ListQueryParam<
  Order,
  | 'id'
  | 'createTime'
  | 'finishTime'
  | 'payAmount'
  | 'orderType'
  | 'payType'
  | 'payTime'
  | 'status'
  | 'userId'
>;
