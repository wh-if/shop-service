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
import { CategoryService } from 'src/service/category.service';
import {
  CategoryInsertDTO,
  CategoryUpdateDTO,
  CategoryListQueryDTO,
  CategoryValidator,
} from 'src/dto/category.dto';
import { Public } from 'src/guard/auth.guard';
import { ParseIntPartialPipe } from 'src/pip/ParseIntPartialPipe';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Public()
  async getCategoryList(
    @Query('query') query: CategoryListQueryDTO,
    @Query('page', ParseIntPartialPipe) page?: number,
    @Query('pageSize', ParseIntPartialPipe) pageSize?: number,
  ) {
    const result = await this.categoryService.getCategoryList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('/:id')
  async findCategory(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.findCategoryById(id);
    return AjaxResult.success(result);
  }

  @Put()
  async updateCategory(@Body() dto: CategoryUpdateDTO) {
    CategoryValidator.id.required().check(dto.id);
    CategoryValidator.name.unRequired().check(dto.name);
    CategoryValidator.avatar.unRequired().check(dto.avatar);
    CategoryValidator.parentId.unRequired().check(dto.parentId);

    const result = await this.categoryService.updateCategory(dto);
    return AjaxResult.success(result);
  }

  @Post()
  async insertCategory(@Body() dto: CategoryInsertDTO) {
    CategoryValidator.name.required().check(dto.name);
    CategoryValidator.avatar.unRequired().check(dto.avatar);
    CategoryValidator.parentId.unRequired().check(dto.parentId);

    const result = await this.categoryService.insertCategory(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete()
  async deleteCategory(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.categoryService.deleteCategory(ids as number[]);
    return AjaxResult.success(result);
  }
}
