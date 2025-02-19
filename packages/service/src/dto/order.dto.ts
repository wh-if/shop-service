import {
  ORDER_DETAIL_TYPE,
  ORDER_STATUS,
  ORDER_TYPE,
  PAY_TYPE,
} from 'src/common/constant';
import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Order } from 'src/entity/order.entity';
import { OrderDetail } from 'src/entity/order_detail.entity';

export type OrderStatusChangeDTO = {
  ids: number[];
  status: ORDER_STATUS;
};

export type OrderPayDTO = Pick<Order, 'id' | 'payType'> & { authcode: string };

export type OrderWithAvatar = Order & { avatar: string };

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

export const OrderValidator: Partial<Record<keyof Order | 'ids', Validator>> = {
  expectTime: Validator.validate('expectTime').string(),
  orderType: Validator.validate('orderType').enum(ORDER_TYPE),
  note: Validator.validate('note').string().max(255),
  payType: Validator.validate('payType').enum(PAY_TYPE),
  couponIds: Validator.validate('couponIds').array('number'),
  status: Validator.validate('status').enum(ORDER_STATUS),
  id: Validator.validate('id').number(),
  ids: Validator.validate('ids').array('number'),
};

export const OrderDetailValidator: Partial<
  Record<keyof OrderDetailInsertDTO, Validator>
> = {
  targetId: Validator.validate('targetId').number(),
  quantity: Validator.validate('quantity').number(),
  chooseOption: Validator.validate('chooseOption').array('number'),
  type: Validator.validate('type').enum(ORDER_DETAIL_TYPE),
};
