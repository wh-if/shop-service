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
import { CategoryService } from 'src/service/category.service';
import {
  CategoryInsertDTO,
  CategoryUpdateDTO,
  CategoryListOrderDTO,
  CategoryListQueryDTO,
} from 'src/dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategoryList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: CategoryListOrderDTO,
    @Query('query') query: CategoryListQueryDTO,
  ) {
    const result = await this.categoryService.getCategoryList(
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
  async findCategory(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.findCategoryById(id);
    return AjaxResult.success(result);
  }

  @Put()
  async updateCategory(@Body() dto: CategoryUpdateDTO) {
    const result = await this.categoryService.updateCategory(dto);
    return AjaxResult.success(result);
  }

  @Post()
  async insertCategory(@Body() dto: CategoryInsertDTO) {
    const result = await this.categoryService.insertCategory(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.deleteCategory(id);
    return AjaxResult.success(result);
  }
}
