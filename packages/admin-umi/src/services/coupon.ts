import { AjaxResult } from '@/requestErrorConfig';
import { List, Coupon } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取优惠券信息 */
export async function getCouponInfo(couponId: number) {
  return request<AjaxResult<Coupon.Coupon>>('/coupon/' + couponId, {
    method: 'GET',
  });
}

/** 获取优惠券列表 */
export async function getCouponList(
  listQueryParam: Coupon.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Coupon.Coupon>>>('/coupon', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增优惠券 */
export async function insertCoupon(data: Coupon.InsertParam) {
  return request<AjaxResult>('/coupon', {
    method: 'POST',
    data,
  });
}

/** 更新优惠券信息 */
export async function updateCoupon(data: Coupon.UpdateParam) {
  return request<AjaxResult>('/coupon', {
    method: 'PUT',
    data,
  });
}

/** 删除优惠券 */
export async function deleteCoupon(ids: number[]) {
  return request<AjaxResult>('/coupon', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
