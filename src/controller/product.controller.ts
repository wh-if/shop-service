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
  ProductListQueryDTO,
  ProductOptionInsertDTO,
  ProductOptionUpdateDTO,
  ProductValidator,
  ProductOptionValidator,
} from 'src/dto/product.dto';
import { Public } from 'src/guard/auth.guard';
import { ParseIntArrayPipe } from 'src/pip/ParseIntPipe';
import { Validator } from 'src/common/validator';

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('product')
  @Public()
  async getProductList(
    @Query('query') query: ProductListQueryDTO,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    Validator.validate('ids').array('number').unRequired().check(query.ids);
    const result = await this.productService.getProductList(query ?? {}, {
      page,
      pageSize,
    });
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
    ProductValidator.id.required().check(dto.id);
    ProductValidator.name.unRequired().check(dto.name);
    ProductValidator.categoryId.unRequired().check(dto.categoryId);
    ProductValidator.description.unRequired().check(dto.description);
    ProductValidator.avatar.unRequired().check(dto.avatar);
    ProductValidator.pictures.unRequired().check(dto.pictures);
    ProductValidator.status.unRequired().check(dto.status);
    const result = await this.productService.updateProduct(dto);
    return AjaxResult.success(result);
  }

  @Post('product')
  async insertProduct(@Body() dto: ProductInsertDTO) {
    ProductValidator.name.required().check(dto.name);
    ProductValidator.categoryId.required().check(dto.categoryId);
    ProductValidator.description.required().check(dto.description);
    ProductValidator.avatar.required().check(dto.avatar);
    ProductValidator.pictures.required().check(dto.pictures);
    ProductValidator.status.required().check(dto.status);
    const result = await this.productService.insertProduct(dto);
    return AjaxResult.success(result.identifiers);
  }

  @Delete('product')
  async deleteProduct(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    const result = await this.productService.deleteProduct(ids);
    return AjaxResult.success(result);
  }

  @Put('product_option')
  async updateProductOption(@Body() dto: ProductOptionUpdateDTO) {
    ProductOptionValidator.name.unRequired().check(dto.name);
    ProductOptionValidator.originalPrice.unRequired().check(dto.originalPrice);
    ProductOptionValidator.price.unRequired().check(dto.price);
    ProductOptionValidator.id.required().check(dto.id);
    const result = await this.productService.updateProductOption(dto);
    return AjaxResult.success(result);
  }

  @Post('product_option')
  async insertProductOption(@Body() dto: ProductOptionInsertDTO) {
    ProductOptionValidator.name.required().check(dto.name);
    ProductOptionValidator.originalPrice.required().check(dto.originalPrice);
    ProductOptionValidator.price.required().check(dto.price);
    ProductOptionValidator.productId.required().check(dto.productId);
    const result = await this.productService.insertProductOption(dto);
    return AjaxResult.judge(result);
  }

  @Delete('product_option')
  async deleteProductOption(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    const result = await this.productService.deleteProductOption(ids);
    return AjaxResult.success(result);
  }
}
