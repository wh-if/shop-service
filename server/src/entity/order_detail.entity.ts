import { OrderDetailType } from 'src/common/constant';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: OrderDetailType })
  type: OrderDetailType;
  @Column('int')
  targetId: number; // type为product就是productId，同理为setsId
  @Column('int')
  quantity: number; // 数量
  @Column('int')
  totalAmount: number; // 总价
  @Column('int')
  discountAmount: number; // 折扣价格，即结算价格
  @Column({ type: 'simple-array' })
  chooseOption: number[]; // 单项的配置选项, type为product 就是product的option id，为sets就是sets包含的product的option id数组
  @Column({ type: 'int', nullable: true })
  useCoupon: number; // 使用的优惠券，套餐无法使用优惠券

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  constructor(
    type: OrderDetailType,
    targetId: number,
    quantity: number,
    chooseOption: number[],
  ) {
    this.type = type;
    this.targetId = targetId;
    this.quantity = quantity;
    this.chooseOption = chooseOption;
  }
}
