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
import { SetsService } from 'src/service/sets.service';
import {
  SetsInsertDTO,
  SetsUpdateDTO,
  SetsListOrderDTO,
  SetsListQueryDTO,
} from 'src/dto/sets.dto';

@Controller('sets')
export class SetsController {
  constructor(private setsService: SetsService) {}

  @Get()
  async getSetsList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: SetsListOrderDTO,
    @Query('query') query: SetsListQueryDTO,
  ) {
    console.log(query);
    const result = await this.setsService.getSetsList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  @Get('/:id')
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

  @Delete('/:id')
  async deleteSets(@Param('id', ParseIntPipe) id: number) {
    const result = await this.setsService.deleteSets(id);
    return AjaxResult.success(result);
  }
}
