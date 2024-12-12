import { Configuration } from 'src/entity/configuration.entity';

export type ConfigurationUpdateDTO = Omit<Configuration, 'key'>;

export type ConfigurationInsertDTO = Omit<Configuration, 'id'>;
