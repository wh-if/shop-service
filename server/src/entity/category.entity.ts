import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 16 })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  avatar: string;
  @Column('int', { default: 0 })
  parentId: number;
}
