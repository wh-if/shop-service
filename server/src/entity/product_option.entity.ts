import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;
  @Column('int')
  price: number; // 价格
  @Column('int')
  originalPrice: number; // 原价
  @Column('int')
  stockQuantity: number; // 库存
  @ManyToOne(() => Product, (product) => product.options)
  product: Product;

  constructor(
    name: string,
    price: number,
    originalPrice: number,
    stockQuantity: number,
  ) {
    this.name = name;
    this.originalPrice = originalPrice;
    this.price = price;
    this.stockQuantity = stockQuantity;
  }
}
