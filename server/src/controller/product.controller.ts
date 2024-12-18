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
import { ProductService } from 'src/service/product.service';
import {
  ProductInsertDTO,
  ProductUpdateDTO,
  ProductListOrderDTO,
  ProductListQueryDTO,
} from 'src/dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProductList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: ProductListOrderDTO,
    @Query('query') query: ProductListQueryDTO,
  ) {
    const result = await this.productService.getProductList(
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
  async findProduct(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.findProductById(id);
    return AjaxResult.success(result);
  }

  @Put()
  async updateProduct(@Body() dto: ProductUpdateDTO) {
    const result = await this.productService.updateProduct(dto);
    return AjaxResult.success(result);
  }

  @Post()
  async insertProduct(@Body() dto: ProductInsertDTO) {
    const result = await this.productService.insertProduct(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.deleteProduct(id);
    return AjaxResult.success(result);
  }
}
