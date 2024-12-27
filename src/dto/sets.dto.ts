import { ListQueryParam } from 'src/common/type';
import { Sets } from 'src/entity/sets.entity';

export type SetsUpdateDTO = Pick<
  Sets,
  'id' | 'avatar' | 'description' | 'name' | 'amount' | 'type'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsInsertDTO = Pick<
  Sets,
  'avatar' | 'description' | 'name' | 'amount' | 'type'
> & { startDate: string; endDate: string; productIds: number[] };

export type SetsListQueryDTO = ListQueryParam<
  Sets,
  'id' | 'endDate' | 'name' | 'type' | 'startDate' | 'createDate'
>;
