import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 4 })
  key: string;
  @Column({ type: 'json' })
  value: Record<string, any>;

  constructor(key: string, value: Record<string, any>) {
    this.key = key;
    this.value = value;
  }
}
