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
  SetsValidator,
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
    SetsValidator.id.required().check(dto.id);
    SetsValidator.name.unRequired().check(dto.name);
    SetsValidator.description.unRequired().check(dto.description);
    SetsValidator.avatar.unRequired().check(dto.avatar);
    SetsValidator.type.unRequired().check(dto.type);
    SetsValidator.startDate.unRequired().check(dto.startDate);
    SetsValidator.endDate.unRequired().check(dto.endDate);
    SetsValidator.productIds.unRequired().check(dto.productIds);
    SetsValidator.categoryId.unRequired().check(dto.categoryId);

    const result = await this.setsService.updateSets(dto);
    return AjaxResult.judge(result);
  }

  @Post()
  async insertSets(@Body() dto: SetsInsertDTO) {
    SetsValidator.name.required().check(dto.name);
    SetsValidator.description.required().check(dto.description);
    SetsValidator.avatar.required().check(dto.avatar);
    SetsValidator.type.required().check(dto.type);
    SetsValidator.startDate.required().check(dto.startDate);
    SetsValidator.endDate.required().check(dto.endDate);
    SetsValidator.productIds.required().check(dto.productIds);
    SetsValidator.categoryId.required().check(dto.categoryId);
    const result = await this.setsService.insertSets(dto);
    return AjaxResult.judge(result);
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
