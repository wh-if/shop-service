import { ORDER_STATUS, ORDER_TYPE, PAY_TYPE } from 'src/common/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './order_detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;
  @Column({ type: 'timestamp', nullable: true })
  payTime: Date;

  @Column({ type: 'timestamp' })
  expectTime: Date; // 用户期望时间
  @Column({ type: 'timestamp', nullable: true })
  finishTime: Date; // 订单完成时间

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.WAIT_PAY })
  status: ORDER_STATUS; // 订单状态
  @Column({ type: 'enum', enum: ORDER_TYPE })
  orderType: ORDER_TYPE; // 订单处理类型

  @Column({ type: 'float' })
  payAmount: number; // 订单支付金额
  @Column({ type: 'float' })
  amount: number; // 订单原始金额

  @Column('int')
  userId: number;
  @Column({ type: 'varchar', nullable: true })
  note: string; // 备注

  @Column({ type: 'enum', enum: PAY_TYPE, nullable: true })
  payType: PAY_TYPE; // 支付方式
  @Column({ type: 'simple-array', nullable: true })
  couponIds: number[]; // 订单使用的优惠券

  @OneToMany(() => OrderDetail, (od) => od.order)
  items: OrderDetail[];

  constructor(
    orderType: ORDER_TYPE,
    expectTime: Date,
    note: string,
    couponIds: number[],
    userId: number,
  ) {
    this.orderType = orderType;
    this.expectTime = expectTime;
    this.note = note;
    this.couponIds = couponIds;
    this.userId = userId;
  }
}
