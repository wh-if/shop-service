import {
  BadRequestException,
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
  ConfigurationListQueryDTO,
  ConfigurationUpdateDTO,
  SystemValidator,
} from 'src/dto/system.dto';
import { Public } from 'src/guard/auth.guard';
import { ParseIntPartialPipe } from 'src/pip/ParseIntPartialPipe';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('config')
  @Public()
  async getConfigList(
    @Query('query') query: ConfigurationListQueryDTO,
    @Query('page', ParseIntPartialPipe) page?: number,
    @Query('pageSize', ParseIntPartialPipe) pageSize?: number,
  ) {
    const result = await this.systemService.getConfigList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('config/:key')
  async findConfigByKey(@Param('key', ParseIntPipe) key: string) {
    const result = await this.systemService.findConfigByKey(key);
    return AjaxResult.success(result);
  }

  @Put('config')
  async updateConfig(@Body() dto: ConfigurationUpdateDTO) {
    SystemValidator.id.required().check(dto.id);
    SystemValidator.value.required().check(dto.value);
    const result = await this.systemService.updateConfig(dto);
    return AjaxResult.success(result);
  }

  @Post('config')
  async insertConfig(@Body() dto: ConfigurationInsertDTO) {
    SystemValidator.key.required().check(dto.key);
    SystemValidator.value.required().check(dto.value);
    const result = await this.systemService.insertConfig(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('config')
  async deleteConfig(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.systemService.deleteConfig(ids as number[]);
    return AjaxResult.success(result);
  }
}
