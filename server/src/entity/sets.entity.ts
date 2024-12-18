import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Sets {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 16 })
  name: string;
  @Column('varchar')
  description: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;
  @Column('int')
  price: number; // 套餐价格

  @Column({ type: 'timestamp' })
  startDate: Date; // 开始日期

  @Column({ type: 'timestamp' })
  endDate: Date; // 结束日期

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date; // 创建时间

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]; // 商品列表
}
