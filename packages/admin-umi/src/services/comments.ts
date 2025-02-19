import { AjaxResult } from '@/requestErrorConfig';
import { List, Comments } from '@/types';
import { request } from '@umijs/max';
import qs from 'qs';

/** 获取评论信息 */
export async function getCommentsInfo(commentsId?: number) {
  return request<AjaxResult<Comments.Comments>>('/comments/' + commentsId, {
    method: 'GET',
  });
}

/** 获取评论列表 */
export async function getCommentsList(
  listQueryParam: Comments.ListQueryParam = {},
  pageParam: List.PageParam = {},
) {
  return request<AjaxResult<List.QueryResult<Comments.Comments>>>('/comments', {
    method: 'GET',
    params: {
      query: listQueryParam,
      ...pageParam,
    },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });
}

/** 新增评论 */
export async function insertComments(data: Comments.InsertParam) {
  return request<AjaxResult>('/comments', {
    method: 'POST',
    data,
  });
}

/** 更新评论信息 */
export async function updateComments(data: Comments.UpdateParam) {
  return request<AjaxResult>('/comments', {
    method: 'PUT',
    data,
  });
}

/** 更新评论状态 */
export async function updateCommentsStatus(data: Comments.UpdateStatusParam) {
  return request<AjaxResult>('/comments/status', {
    method: 'PUT',
    data,
  });
}

/** 删除评论 */
export async function deleteComments(ids: number[]) {
  return request<AjaxResult>('/comments', {
    method: 'DELETE',
    params: {
      ids,
    },
  });
}
