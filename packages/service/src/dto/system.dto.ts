import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Configuration } from 'src/entity/configuration.entity';

export type ConfigurationUpdateDTO = Omit<Configuration, 'key'>;

export type ConfigurationInsertDTO = Omit<Configuration, 'id'>;

export type ConfigurationListQueryDTO = ListQueryParam<
  Configuration,
  'id' | 'key'
>;

export const SystemValidator: Record<keyof Configuration, Validator> = {
  id: Validator.validate('id').number(),
  key: Validator.validate('key').string().max(12),
  value: Validator.validate('value'),
};
