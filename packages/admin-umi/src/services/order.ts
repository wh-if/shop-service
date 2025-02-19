import { AjaxResult } from '@/requestErrorConfig';
import { List, Order } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取订单信息 */
export async function getOrderInfo(orderId?: number) {
  return request<AjaxResult<Order.Order>>('/order/' + orderId, {
    method: 'GET',
  });
}

/** 获取订单列表 */
export async function getOrderList(
  listQueryParam: Order.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Order.Order>>>('/order', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增订单 */
export async function insertOrder(data: Order.InsertParam) {
  return request<AjaxResult>('/order', {
    method: 'POST',
    data,
  });
}

/** 取消订单 */
export async function cancelOrder(orderId: number) {
  return request<AjaxResult>('/order/cancel/' + orderId, {
    method: 'PUT',
  });
}

/** 用户移除订单 */
export async function removeOrder(orderId: number) {
  return request<AjaxResult>('/order/remove/' + orderId, {
    method: 'PUT',
  });
}

/** 支付订单 */
export async function payOrder(data: Order.PayParam) {
  return request<AjaxResult>('/order/pay', {
    method: 'POST',
    data,
  });
}

/** 更新订单状态 */
export async function updateOrderStatus(data: Order.UpdateStatusParam) {
  return request<AjaxResult>('/order/status', {
    method: 'PUT',
    data,
  });
}

/** 删除订单 */
export async function deleteOrder(ids: number[]) {
  return request<AjaxResult>('/order', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
