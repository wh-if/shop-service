export interface RequestWithUserInfo extends Express.Request {
  userInfo: {
    userId: string;
    telNumber: string;
  };
}

export interface ListPageParam {
  page: number;
  pageSize: number;
}

export type ListOrderType<T, G extends keyof T> = Partial<
  Record<G, 'DESC' | 'ASC'>
>;

/**
 * any解释
 * string => string => like
 * date => [startTimeStamp, endTimeStamp] => between
 * enum => [] => in
 */
export type ListQueryParam<T, G extends keyof T> = Partial<Record<G, any>>;
