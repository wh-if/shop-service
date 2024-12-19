import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { booleanToNumberTransformer } from './transformer';

// 用户领取的优惠券
@Entity()
export class ReceivedCoupon {
  @PrimaryColumn()
  couponId: number; // 优惠券id
  @PrimaryColumn()
  userId: number; // 用户id
  @CreateDateColumn({ type: 'timestamp' })
  addTime: Date; // 领取时间
  @Column({
    type: 'boolean',
    default: false,
    transformer: booleanToNumberTransformer,
  })
  hasUsed: boolean; // 是否已使用

  constructor(userId: number, couponId: number) {
    this.userId = userId;
    this.couponId = couponId;
  }
}
