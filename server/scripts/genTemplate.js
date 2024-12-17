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
  const TEMPLATE = `import { ListOrderType, ListQueryParam } from 'src/common/type';
import { ${FIRST_UPPER_KEYNAME} } from 'src/entity/${KEYNAME}.entity';

export type ${FIRST_UPPER_KEYNAME}UpdateDTO = Pick<${FIRST_UPPER_KEYNAME}, ''>;

export type ${FIRST_UPPER_KEYNAME}InsertDTO = Pick<${FIRST_UPPER_KEYNAME}, ''>;

export type ${FIRST_UPPER_KEYNAME}ListQueryDTO = ListQueryParam<
  ${FIRST_UPPER_KEYNAME},
  'id' | 'key'
>;

export type ${FIRST_UPPER_KEYNAME}ListOrderDTO = ListOrderType<${FIRST_UPPER_KEYNAME}, 'id'>;
`;
  const filePath = path.join(__dirname, '../src/dto/' + KEYNAME + '.dto.ts');
  createFile(filePath, TEMPLATE);
}

// 创建service
function genService() {
  const TEMPLATE = `import { Injectable } from '@nestjs/common';
import { ${FIRST_UPPER_KEYNAME} } from 'src/entity/${KEYNAME}.entity';
import {
  ${FIRST_UPPER_KEYNAME}ListOrderDTO,
  ${FIRST_UPPER_KEYNAME}ListQueryDTO,
  ${FIRST_UPPER_KEYNAME}InsertDTO,
  ${FIRST_UPPER_KEYNAME}UpdateDTO,
} from 'src/dto/${KEYNAME}.dto';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ListPageParam } from 'src/common/type';
import { BaseService } from './base.service';

@Injectable()
export class ${FIRST_UPPER_KEYNAME}Service extends BaseService {
  constructor(private dataSource: DataSource) {
    super();
  }

  public get ${KEYNAME}QBuilder(): SelectQueryBuilder<${FIRST_UPPER_KEYNAME}> {
    return this.dataSource.createQueryBuilder(${FIRST_UPPER_KEYNAME}, '${KEYNAME}');
  }

  async get${FIRST_UPPER_KEYNAME}List(
    query: ${FIRST_UPPER_KEYNAME}ListQueryDTO,
    order: ${FIRST_UPPER_KEYNAME}ListOrderDTO,
    page: ListPageParam,
  ) {
    const sqlBuilder = this.${KEYNAME}QBuilder
      .limit(page.pageSize)
      .offset((page.page - 1) * page.pageSize)
      .orderBy(order);

    this.genWhereSql<${FIRST_UPPER_KEYNAME}, ${FIRST_UPPER_KEYNAME}ListQueryDTO>(
      sqlBuilder,
      '${KEYNAME}',
      query,
      {
        stringType: ['id'],
        timeType: [],
        enumType: [],
        numberType: [],
      },
    );

    const [list, total] = await sqlBuilder.getManyAndCount();
    return {
      list,
      total,
    };
  }

  find${FIRST_UPPER_KEYNAME}ById(id: number) {
    return this.${KEYNAME}QBuilder.where({ id }).getOne();
  }

  insert${FIRST_UPPER_KEYNAME}(dto: ${FIRST_UPPER_KEYNAME}InsertDTO) {
    const ${KEYNAME} = new ${FIRST_UPPER_KEYNAME}();
    return this.${KEYNAME}QBuilder.insert().values(${KEYNAME}).execute();
  }

  update${FIRST_UPPER_KEYNAME}(dto: ${FIRST_UPPER_KEYNAME}UpdateDTO) {
    return this.${KEYNAME}QBuilder
      .update()
      .set(TODO)
      .where({ id: dto.id })
      .execute();
  }

  delete${FIRST_UPPER_KEYNAME}(id: number) {
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
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { ${FIRST_UPPER_KEYNAME}Service } from 'src/service/${KEYNAME}.service';
import {
  ${FIRST_UPPER_KEYNAME}InsertDTO,
  ${FIRST_UPPER_KEYNAME}UpdateDTO,
  ${FIRST_UPPER_KEYNAME}ListOrderDTO,
  ${FIRST_UPPER_KEYNAME}ListQueryDTO,
} from 'src/dto/${KEYNAME}.dto';

@Controller('${KEYNAME}')
export class ${FIRST_UPPER_KEYNAME}Controller {
  constructor(private ${KEYNAME}Service: ${FIRST_UPPER_KEYNAME}Service) {}

  @Get('${KEYNAME}')
  async get${FIRST_UPPER_KEYNAME}List(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: ${FIRST_UPPER_KEYNAME}ListOrderDTO,
    @Query('query') query: ${FIRST_UPPER_KEYNAME}ListQueryDTO,
  ) {
    if (page && pageSize) {
      return AjaxResult.success(
        await this.${KEYNAME}Service.getConfigList(query ?? {}, order ?? {}, {
          page,
          pageSize,
        }),
      );
    } else {
      return AjaxResult.fail('参数不能为空');
    }
  }

  @Get('${KEYNAME}/:id')
  async find${FIRST_UPPER_KEYNAME}(@Param('id') id: number) {
    const result = await this.${KEYNAME}Service.find${FIRST_UPPER_KEYNAME}ById(id);
    return AjaxResult.success(result);
  }

  @Put('${KEYNAME}')
  async update${FIRST_UPPER_KEYNAME}(@Body() dto: ${FIRST_UPPER_KEYNAME}UpdateDTO) {
    const result = await this.${KEYNAME}Service.update${FIRST_UPPER_KEYNAME}(dto);
    return AjaxResult.success(result);
  }

  @Post('${KEYNAME}')
  async insert${FIRST_UPPER_KEYNAME}(@Body() dto: ${FIRST_UPPER_KEYNAME}InsertDTO) {
    const result = await this.${KEYNAME}Service.insert${FIRST_UPPER_KEYNAME}(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('${KEYNAME}/:id')
  async delete${FIRST_UPPER_KEYNAME}(@Param('id', ParseIntPipe) id: number) {
    const result = await this.${KEYNAME}Service.delete${FIRST_UPPER_KEYNAME}(id);
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
