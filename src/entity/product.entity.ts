import { PRODUCT_STATUS } from 'src/common/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { ProductOption } from './product_option.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 32 })
  name: string;
  @Column('int')
  categoryId: number;
  @Column('varchar')
  description: string;
  @Column('varchar')
  avatar: string; // 头像
  @Column('simple-array')
  pictures: string[]; // 详细图片
  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date; // 创建时间
  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date; // 更新时间
  @Column({ type: 'enum', enum: PRODUCT_STATUS, default: PRODUCT_STATUS.OFF })
  status: PRODUCT_STATUS;
  @ManyToMany(() => Coupon, (coupon) => coupon.products)
  coupons: Coupon[];
  @OneToMany(() => ProductOption, (po) => po.product)
  options: ProductOption[];
}
