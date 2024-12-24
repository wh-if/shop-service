import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Configuration } from 'src/entity/configuration.entity';

export type ConfigurationUpdateDTO = Omit<Configuration, 'key'>;

export type ConfigurationInsertDTO = Omit<Configuration, 'id'>;

export type ConfigurationListQueryDTO = ListQueryParam<
  Configuration,
  'id' | 'key'
>;

export type ConfigurationListOrderDTO = ListOrderType<Configuration, 'id'>;
