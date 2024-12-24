import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { COUPON_TYPE } from 'src/common/constant';

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

  @Column({ type: 'enum', enum: COUPON_TYPE, default: COUPON_TYPE.CUT })
  type: COUPON_TYPE;

  @Column('int')
  amount: number; // 折扣数额或打折比例, 10减10元，0.5打五折

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
