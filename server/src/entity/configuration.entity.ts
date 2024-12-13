import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 12 })
  key: string;
  @Column({ type: 'json' })
  value: object;

  constructor(key: string, value: object) {
    this.key = key;
    this.value = value;
  }
}
