import { USER_ROLE, USER_STATUS } from 'src/common/constant';
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 20 })
  name: string;
  @Column({ type: 'varchar', length: 11 })
  telNumber: string;
  @Column({ type: 'varchar', nullable: true })
  avatar: string;
  @Column({ type: 'varchar' })
  password: string;
  @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ON })
  status: USER_STATUS; // 账号状态
  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE; // 账户类型
  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
  @Column({ type: 'timestamp', nullable: true })
  lastLoginTime: Date; // 最后登录时间
  @ManyToMany(() => Product)
  @JoinTable({ name: 'collect' })
  collects: Product[];
}
