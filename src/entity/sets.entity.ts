import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { COUPON_TYPE, PRODUCT_STATUS } from 'src/common/constant';

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
  categoryId: number;
  @Column({ type: 'enum', enum: COUPON_TYPE, default: COUPON_TYPE.CUT })
  type: COUPON_TYPE;

  @Column({ type: 'float' })
  amount: number; // 折扣数额或打折比例, 10减10元，0.5打五折

  @Column({ type: 'enum', enum: PRODUCT_STATUS, default: PRODUCT_STATUS.OFF })
  status: PRODUCT_STATUS; // 状态

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date; // 创建时间

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date; // 更新时间

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]; // 商品列表
}
