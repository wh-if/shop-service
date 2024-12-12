import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { SystemService } from 'src/service/system.service';
import {
  ConfigurationInsertDTO,
  ConfigurationUpdateDTO,
} from 'src/dto/system.dto';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('config')
  async getList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<AjaxResult> {
    return AjaxResult.success(await this.systemService.getList(page, pageSize));
  }

  @Get('config/:key')
  async find(@Param('key') key: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.systemService.findByKey(key));
  }

  @Put('config')
  async update(@Body() dto: ConfigurationUpdateDTO): Promise<AjaxResult> {
    const result = await this.systemService.update(dto);
    return AjaxResult.success(result);
  }

  @Post('config')
  async insert(@Body() dto: ConfigurationInsertDTO): Promise<AjaxResult> {
    const result = await this.systemService.insert(dto);
    return AjaxResult.success(result);
  }
}
