import { ORDER_DETAIL_TYPE } from 'src/common/constant';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Collect {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int')
  userId: number;
  @Column('int')
  targetId: number;
  @Column({
    type: 'enum',
    enum: ORDER_DETAIL_TYPE,
  })
  targetType: ORDER_DETAIL_TYPE;
}
