import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(private dataSource: DataSource) {}

  getList() {}

  find(id: number) {}

  update() {}

  remove(id: number) {}
}
