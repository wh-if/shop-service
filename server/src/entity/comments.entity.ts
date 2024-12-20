import { COMMENTS_STATUS } from 'src/common/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  userId: number;
  @Column('int')
  orderId: number;
  @Column('varchar')
  content: string; // 文本
  @Column({ type: 'simple-array', nullable: true })
  pictures: string[]; // 图片
  @Column({ type: 'int', nullable: true })
  star: number; // 评分
  @Column({
    type: 'enum',
    enum: COMMENTS_STATUS,
    default: COMMENTS_STATUS.PENDING,
  })
  status: COMMENTS_STATUS;
  @CreateDateColumn({ type: 'timestamp' })
  createTime: string;
  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: string;
  @Column({ type: 'int', nullable: true })
  parentId: number;
}
