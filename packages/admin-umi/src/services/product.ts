import { AjaxResult } from '@/requestErrorConfig';
import { List, Product } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取产品信息 */
export async function getProductInfo(productId?: number) {
  return request<AjaxResult<Product.Product>>('/product/' + productId, {
    method: 'GET',
  });
}

/** 获取产品列表 */
export async function getProductList(
  listQueryParam: Product.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Product.Product>>>('/product', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增产品 */
export async function insertProduct(data: Product.InsertParam) {
  return request<AjaxResult>('/product', {
    method: 'POST',
    data,
  });
}

/** 更新产品信息 */
export async function updateProduct(data: Product.UpdateParam) {
  return request<AjaxResult>('/product', {
    method: 'PUT',
    data,
  });
}

/** 删除产品 */
export async function deleteProduct(ids: number[]) {
  return request<AjaxResult>('/product', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}

/** 新增产品选项 */
export async function insertProductOption(data: Product.OptionInsertParam) {
  return request<AjaxResult>('/product_option', {
    method: 'POST',
    data,
  });
}

/** 更新产品选项信息 */
export async function updateProductOption(data: Product.OptionUpdateParam) {
  return request<AjaxResult>('/product_option', {
    method: 'PUT',
    data,
  });
}

/** 删除产品选项 */
export async function deleteProductOption(ids: number[]) {
  return request<AjaxResult>('/product_option', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
