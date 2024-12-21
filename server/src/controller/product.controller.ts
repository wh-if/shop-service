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
  ProductOptionInsertDTO,
  ProductOptionUpdateDTO,
} from 'src/dto/product.dto';
import { Public } from 'src/guard/auth.guard';

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('product')
  @Public()
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

  @Get('product/:id')
  @Public()
  async findProduct(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.findProductById(id);
    return AjaxResult.success(result);
  }

  @Put('product')
  async updateProduct(@Body() dto: ProductUpdateDTO) {
    const result = await this.productService.updateProduct(dto);
    return AjaxResult.success(result);
  }

  @Post('product')
  async insertProduct(@Body() dto: ProductInsertDTO) {
    const result = await this.productService.insertProduct(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('product/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.deleteProduct(id);
    return AjaxResult.success(result);
  }

  @Put('product_option')
  async updateProductOption(@Body() dto: ProductOptionUpdateDTO) {
    const result = await this.productService.updateProductOption(dto);
    return AjaxResult.success(result);
  }

  @Post('product_option')
  async insertProductOption(@Body() dto: ProductOptionInsertDTO) {
    const result = await this.productService.insertProductOption(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Delete('product_option/:id')
  async deleteProductOption(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.deleteProductOption(id);
    return AjaxResult.success(result);
  }
}
