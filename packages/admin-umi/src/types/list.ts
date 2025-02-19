/* eslint-disable */
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
