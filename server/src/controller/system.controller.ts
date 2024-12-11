import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { SystemService } from 'src/service/system.service';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

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
}
