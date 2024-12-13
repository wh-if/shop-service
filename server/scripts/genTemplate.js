const fs = require('fs/promises');
const path = require('path');

/**
 * COMMAND => npm run gen hello
 * KEYNAME => hello
 * FIRST_UPPER_KEYNAME => Hello
 */

const KEYNAME = process.argv.slice(2).at(0);
const FIRST_UPPER_KEYNAME = KEYNAME.charAt(0).toUpperCase() + KEYNAME.slice(1);

genEntity();
genDto();
genService();
genController();
updateAppModule();

function genEntity() {
  const TEMPLATE = `import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${FIRST_UPPER_KEYNAME} {
  @PrimaryGeneratedColumn()
  id: number;

  constructor() {}
}
`;
  const filePath = path.join(
    __dirname,
    '../src/entity/' + KEYNAME + '.entity.ts',
  );
  createFile(filePath, TEMPLATE);
}

// 创建DTO
function genDto() {
  const TEMPLATE = `import { ${FIRST_UPPER_KEYNAME} } from 'src/entity/${KEYNAME}.entity';

export type ${FIRST_UPPER_KEYNAME}UpdateDTO = Omit<${FIRST_UPPER_KEYNAME}, ''>;

export type ${FIRST_UPPER_KEYNAME}InsertDTO = Omit<${FIRST_UPPER_KEYNAME}, 'id'>;
`;
  const filePath = path.join(__dirname, '../src/dto/' + KEYNAME + '.dto.ts');
  createFile(filePath, TEMPLATE);
}

// 创建service
function genService() {
  const TEMPLATE = `import { Injectable } from '@nestjs/common';
import { ${FIRST_UPPER_KEYNAME} } from 'src/entity/${KEYNAME}.entity';
import {
  ${FIRST_UPPER_KEYNAME}InsertDTO,
  ${FIRST_UPPER_KEYNAME}UpdateDTO,
} from 'src/dto/${KEYNAME}.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ${FIRST_UPPER_KEYNAME}Service {
  ${KEYNAME}QBuilder: SelectQueryBuilder<${FIRST_UPPER_KEYNAME}>;
  constructor(dataSource: DataSource) {
    this.${KEYNAME}QBuilder = dataSource.createQueryBuilder(
      ${FIRST_UPPER_KEYNAME},
      '${KEYNAME}',
    );
  }

  async getList(page: number, pageSize: number) {
    const list = await this.${KEYNAME}QBuilder
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .getMany();

    const total = await this.${KEYNAME}QBuilder.getCount();
    return {
      list,
      total,
    };
  }

  findById(id: number) {
    return this.${KEYNAME}QBuilder.where({ id }).getOne();
  }

  insert(dto: ${FIRST_UPPER_KEYNAME}InsertDTO) {
    const ${KEYNAME} = new ${FIRST_UPPER_KEYNAME}(TODO);
    return this.${KEYNAME}QBuilder.insert().values(${KEYNAME}).execute();
  }

  update(dto: ${FIRST_UPPER_KEYNAME}UpdateDTO) {
    return this.${KEYNAME}QBuilder
      .update()
      .set(TODO)
      .where({ id: dto.id })
      .execute();
  }

  delete(id: number) {
    return this.${KEYNAME}QBuilder.delete().where({ id }).execute();
  }
}
`;
  const filePath = path.join(
    __dirname,
    '../src/service/' + KEYNAME + '.service.ts',
  );
  createFile(filePath, TEMPLATE);
}

// 创建controller
function genController() {
  const TEMPLATE = `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { ${FIRST_UPPER_KEYNAME}Service } from 'src/service/${KEYNAME}.service';
import {
  ${FIRST_UPPER_KEYNAME}InsertDTO,
  ${FIRST_UPPER_KEYNAME}UpdateDTO,
} from 'src/dto/${KEYNAME}.dto';

@Controller('${KEYNAME}')
export class ${FIRST_UPPER_KEYNAME}Controller {
  constructor(private ${KEYNAME}Service: ${FIRST_UPPER_KEYNAME}Service) {}

  @Get('${KEYNAME}')
  async getList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return AjaxResult.success(await this.${KEYNAME}Service.getList(page, pageSize));
  }

  @Get('${KEYNAME}/:id')
  async find(@Param('id') id: number) {
    return AjaxResult.success(await this.${KEYNAME}Service.findById(id));
  }

  @Put('${KEYNAME}')
  async update(@Body() dto: ${FIRST_UPPER_KEYNAME}UpdateDTO) {
    const result = await this.${KEYNAME}Service.update(dto);
    return AjaxResult.success(result);
  }

  @Post('${KEYNAME}')
  async insert(@Body() dto: ${FIRST_UPPER_KEYNAME}InsertDTO) {
    const result = await this.${KEYNAME}Service.insert(dto);
    return AjaxResult.success(result);
  }

  @Delete('${KEYNAME}/:id')
  async delete(@Param('id') id: number) {
    const result = await this.${KEYNAME}Service.delete(id);
    return AjaxResult.success(result);
  }
}
`;
  const filePath = path.join(
    __dirname,
    '../src/controller/' + KEYNAME + '.controller.ts',
  );
  createFile(filePath, TEMPLATE);
}

// 更新app.module.ts
function updateAppModule() {
  const appPath = path.join(__dirname, '../src/app.module.ts');
  fs.readFile(appPath, { encoding: 'utf-8' }).then((file) => {
    let builder = file.split('');

    // 生成导入语句
    let index = file.indexOf('export');
    while (true) {
      index--;
      if (file.charAt(index - 2) === ';') {
        let str = `import { ${FIRST_UPPER_KEYNAME}Service } from './service/${KEYNAME}.service';
import { ${FIRST_UPPER_KEYNAME}Controller } from './controller/${KEYNAME}.controller';\n`;
        builder.splice(index, 0, str);
        break;
      }
    }

    // 更新controllers数组
    let start = file.indexOf('controllers');
    index = file.slice(start).indexOf('\n');
    builder.splice(start + index - 1, 0, `, ${FIRST_UPPER_KEYNAME}Controller`);

    // 更新providers数组
    start = file.indexOf('providers');
    index = file.slice(start).indexOf('\n');
    builder.splice(start + index, 0, `, ${FIRST_UPPER_KEYNAME}Service`);

    fs.writeFile(appPath, builder.join('')).then(() => {
      console.log('update app.module.ts');
    });
  });
}

// 生成文件
function createFile(path, content) {
  fs.stat(path).catch((e) => {
    if (e.code === 'ENOENT') {
      fs.writeFile(path, content).then((val) => {
        console.log('create ' + path);
      });
    }
  });
}
