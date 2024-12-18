import { PRODUCT_STATUS } from 'src/common/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 32 })
  name: string;
  @Column('varchar')
  description: string;
  @Column('varchar')
  avatar: string; // 头像
  @Column('simple-array')
  pictures: string[]; // 详细图片
  @Column('int')
  price: number; // 价格
  @Column('int')
  originalPrice: number; // 原价
  @Column('int')
  stockQuantity: number; // 库存
  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date; // 创建时间
  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date; // 更新时间
  @Column({ type: 'enum', enum: PRODUCT_STATUS, default: PRODUCT_STATUS.OFF })
  status: PRODUCT_STATUS;
  @Column({ type: 'json', nullable: true })
  options: object; // 商品可选项配置
}
