import {
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
import { SystemService } from 'src/service/system.service';
import {
  ConfigurationInsertDTO,
  ConfigurationListOrderDTO,
  ConfigurationListQueryDTO,
  ConfigurationUpdateDTO,
} from 'src/dto/system.dto';
import { Public } from 'src/guard/auth.guard';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('config')
  @Public()
  async getConfigList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: ConfigurationListOrderDTO,
    @Query('query') query: ConfigurationListQueryDTO,
  ) {
    const result = await this.systemService.getConfigList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  @Get('config/:key')
  async findConfigByKey(@Param('key', ParseIntPipe) key: string) {
    const result = await this.systemService.findConfigByKey(key);
    return AjaxResult.success(result);
  }

  @Put('config')
  async updateConfig(@Body() dto: ConfigurationUpdateDTO) {
    const result = await this.systemService.updateConfig(dto);
    return AjaxResult.success(result);
  }

  @Post('config')
  async insertConfig(@Body() dto: ConfigurationInsertDTO) {
    const result = await this.systemService.insertConfig(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('config/:id')
  async deleteConfig(@Param('id', ParseIntPipe) id: number) {
    const result = await this.systemService.deleteConfig(id);
    return AjaxResult.success(result);
  }
}
