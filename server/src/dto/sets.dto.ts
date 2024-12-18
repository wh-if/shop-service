import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Sets } from 'src/entity/sets.entity';

export type SetsUpdateDTO = Pick<
  Sets,
  'id' | 'avatar' | 'description' | 'name' | 'price'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsInsertDTO = Pick<
  Sets,
  'avatar' | 'description' | 'name' | 'price'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsListQueryDTO = ListQueryParam<
  Sets,
  'id' | 'endDate' | 'name' | 'price' | 'startDate' | 'createDate'
>;

export type SetsListOrderDTO = ListOrderType<
  Sets,
  'id' | 'createDate' | 'endDate' | 'price' | 'startDate'
>;
