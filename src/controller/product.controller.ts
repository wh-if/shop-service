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

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('product')
  @Public()
  async getProductList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('query') query: ProductListQueryDTO,
  ) {
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
  async deleteProduct(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }

    const result = await this.productService.deleteProduct(ids as number[]);
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
  async deleteProductOption(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.productService.deleteProductOption(
      ids as number[],
    );
    return AjaxResult.success(result);
  }
}
