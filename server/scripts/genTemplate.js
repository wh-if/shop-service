const fs = require('fs/promises');
const path = require('path');

/**
 * COMMAND => npm run gen hello
 * KEYNAME => hello
 * FIRST_UPPER_KEYNAME => Hello
 */

const KEYNAME = process.argv.slice(2).at(0);
const FIRST_UPPER_KEYNAME = KEYNAME.charAt(0).toUpperCase() + KEYNAME.slice(1);

genService();
genController();
updateAppModule();

// 创建service
function genService() {
  const DTO_TEMPLATE = `import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ${FIRST_UPPER_KEYNAME}Service{
  constructor(private dataSource: DataSource) {}

  getList() {

  }

  find(id: number){

  }

  update(){

  }

  remove(id: number){

  }
}
  `;
  const filePath = path.join(
    __dirname,
    '../src/service/' + KEYNAME + '.service.ts',
  );
  createFile(filePath, DTO_TEMPLATE);
}

// 创建controller
function genController() {
  const DTO_TEMPLATE = `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { ${FIRST_UPPER_KEYNAME}Service } from 'src/service/${KEYNAME}.service';

@Controller('${KEYNAME}')
export class ${FIRST_UPPER_KEYNAME}Controller {
  constructor(private ${KEYNAME}Service: ${FIRST_UPPER_KEYNAME}Service) {}

  @Get()
  getList(): AjaxResult {
    return AjaxResult.success([]);
  }

  @Get('/:key')
  find(@Param('key') key: string): AjaxResult {
    return AjaxResult.fail(key);
  }

  @Post()
  insert(@Body() dto: object): AjaxResult {
    return AjaxResult.success(dto);
  }

  @Put()
  update(@Body() dto: object): AjaxResult {
    return AjaxResult.success(dto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number): AjaxResult {
    return AjaxResult.success({ id });
  }
}`;
  const filePath = path.join(
    __dirname,
    '../src/controller/' + KEYNAME + '.controller.ts',
  );
  createFile(filePath, DTO_TEMPLATE);
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
