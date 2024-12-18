import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { DataSource } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';

@Injectable()
export class CollectService {
  constructor(
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  async getCollectList(userId: number) {
    const user = await this.userService.userQBuilder
      .where({ id: userId })
      .leftJoinAndSelect('user.collects', 'product')
      .getOne();
    return { list: user.collects };
  }

  async addCollect(userId: number, productId: number) {
    const user = await this.userService.userQBuilder
      .where({ id: userId })
      .leftJoinAndSelect('user.collects', 'product')
      .getOne();
    const product = await this.dataSource
      .getRepository(Product)
      .findOne({ where: { id: productId } });

    let collectResult = false;
    if (!!product) {
      user.collects.push(product);
      await this.dataSource.getRepository(User).save(user);
      collectResult = true;
    }

    return collectResult;
  }

  async cancelCollect(userId: number, productId: number) {
    const user = await this.userService.userQBuilder
      .where({ id: userId })
      .leftJoinAndSelect('user.collects', 'product')
      .getOne();
    user.collects = user.collects.filter((item) => item.id !== productId);
    await this.dataSource.getRepository(User).save(user);
    return true;
  }
}
