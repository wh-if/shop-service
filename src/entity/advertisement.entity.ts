
import { ADVERTISEMENT_SHOW, ADVERTISEMENT_STATUS, ORDER_STATUS, ORDER_TYPE, PAY_TYPE } from 'src/common/constant';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn()
  id: number;

  title: string; // 标题

  status: ADVERTISEMENT_STATUS;
  showAt: ADVERTISEMENT_SHOW;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;
  @UpdateDateColumn({type: 'timestamp'})
  updateTime: Date;

  promotion

}
