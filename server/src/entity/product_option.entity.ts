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
  @ManyToOne(() => Product, (product) => product.options)
  product: Product;

  constructor(name: string, price: number, originalPrice: number) {
    this.name = name;
    this.originalPrice = originalPrice;
    this.price = price;
  }
}
