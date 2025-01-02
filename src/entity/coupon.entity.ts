import { COUPON_TYPE, COUPON_TARGET, COUPON_STATUS } from 'src/common/constant';
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

// 优惠券
@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: COUPON_TYPE, default: COUPON_TYPE.CUT })
  type: COUPON_TYPE;

  @Column('int')
  needFull: number; // 满多少享受折扣

  @Column({ type: 'float' })
  amount: number; // 折扣数额或打折比例

  @Column('int')
  receiveLimit: number; // 单用户领取数量限制

  @Column({ type: 'enum', enum: COUPON_TARGET, default: COUPON_TARGET.ORDER })
  target: COUPON_TARGET; // 作用对象

  @Column({ type: 'int' })
  totalQuantity: number; // 优惠券总数量

  @Column({ type: 'int' })
  remainingQuantity: number; // 剩余可用数量

  @Column({ type: 'timestamp' })
  startDate: Date; // 优惠券开始日期

  @Column({ type: 'timestamp' })
  endDate: Date; // 优惠券结束日期

  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date; // 优惠券创建时间

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date; // 优惠券最后更新时间

  @Column({ type: 'enum', enum: COUPON_STATUS, default: COUPON_STATUS.OFF })
  status: COUPON_STATUS; // 优惠券状态

  @Column({ type: 'varchar', nullable: true })
  description: string; // 备注、描述信息

  @ManyToMany(() => Product, (product) => product.coupons)
  @JoinTable()
  products: Product[]; // 可用的商品列表
}
