import { USER_ROLE, USER_STATUS } from 'src/common/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @Column({ type: 'simple-array' })
  roles: USER_ROLE[]; // 账户拥有的角色类型
  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
  @Column({ type: 'timestamp', nullable: true })
  lastLoginTime: Date; // 最后登录时间
}
