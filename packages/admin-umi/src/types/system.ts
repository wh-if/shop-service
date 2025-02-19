/* eslint-disable */
import { List } from '.';

export declare namespace SystemConfig {
  interface SystemConfig {
    id: number;
    key: string;
    value: object;
  }

  type InsertParam = Pick<SystemConfig, 'key' | 'value'>;

  type UpdateParam = Pick<SystemConfig, 'id' | 'value'>;

  type ListQueryParam = List.QueryParam<SystemConfig, 'id' | 'key', 'id'>;
}
