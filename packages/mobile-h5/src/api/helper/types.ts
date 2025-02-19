/* eslint-disable */

/**
 * @prop SUCCESS - 成功
 * @prop FAIL - 一般失败
 * @prop TOKEN_REFRESH - token过期刷新
 *  */
enum AjaxResultCode {
  SUCCESS,
  FAIL,
  TOKEN_REFRESH,
}

export enum PLATFORM_TYPE {
  MOBILE_H5 = 'MOBILE_H5',
  ADMIN = 'ADMIN',
}

export interface AjaxResult<T = object> {
  code: AjaxResultCode;
  message: string;
  data: T;
}

export declare namespace List {
  type QueryParam<T, G extends keyof T, Z extends keyof T | undefined> = Partial<
    Record<G, string | number | string[] | number[]> & {
      ids: number[];
      orderBy: Z;
      order: 'DESC' | 'ASC';
    }
  >;

  type PageParam = {
    page?: number;
    pageSize?: number;
  };

  type QueryResult<T> = {
    list: T[];
    total: number;
  };
}
