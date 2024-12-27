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
import { SetsService } from 'src/service/sets.service';
import {
  SetsInsertDTO,
  SetsUpdateDTO,
  SetsListQueryDTO,
} from 'src/dto/sets.dto';
import { Public } from 'src/guard/auth.guard';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  @Public()
  async getSetsList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('query') query: SetsListQueryDTO,
  ) {
    console.log(query);
    const result = await this.setsService.getSetsList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('/:id')
  @Public()
  async findSets(@Param('id', ParseIntPipe) id: number) {
    const result = await this.setsService.findSetsById(id);
    return AjaxResult.success(result);
  }

  @Put()
  async updateSets(@Body() dto: SetsUpdateDTO) {
    const result = await this.setsService.updateSets(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Post()
  async insertSets(@Body() dto: SetsInsertDTO) {
    const result = await this.setsService.insertSets(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Delete()
  async deleteSets(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.setsService.deleteSets(ids as number[]);
    return AjaxResult.success(result);
  }
}
