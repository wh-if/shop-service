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
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { CouponService } from 'src/service/coupon.service';
import {
  CouponInsertDTO,
  CouponUpdateDTO,
  CouponListOrderDTO,
  CouponListQueryDTO,
} from 'src/dto/coupon.dto';
import { ExpressReqWithUser } from 'src/common/type';

@Controller()
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get('coupon')
  async getCouponList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: CouponListOrderDTO,
    @Query('query') query: CouponListQueryDTO,
  ) {
    const result = await this.couponService.getCouponList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  @Get('coupon/:id')
  async findCoupon(@Param('id', ParseIntPipe) id: number) {
    const result = await this.couponService.findCouponById(id);
    return AjaxResult.success(result);
  }

  @Put('coupon')
  async updateCoupon(@Body() dto: CouponUpdateDTO) {
    const result = await this.couponService.updateCoupon(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Post('coupon')
  async insertCoupon(@Body() dto: CouponInsertDTO) {
    const result = await this.couponService.insertCoupon(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Delete('coupon/:id')
  async deleteCoupon(@Param('id', ParseIntPipe) id: number) {
    await this.couponService.deleteCoupon(id);
    return AjaxResult.success();
  }

  // 领取优惠券
  @Post('receive_coupon')
  async receiveCoupon(
    @Query('couponId', ParseIntPipe) couponId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.couponService.receiveCoupon(
      request.userInfo.userId,
      couponId,
    );
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  // 我的优惠券列表(未使用的)
  @Get('receive_coupon/me')
  async getCouponsByUser(@Req() request: ExpressReqWithUser) {
    const result = await this.couponService.getCouponsByUser(
      request.userInfo.userId,
    );
    return AjaxResult.success(result);
  }

  // 产品的可用优惠券
  @Get('product_coupon/:productId')
  async getCouponsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const result = await this.couponService.getCouponsByProduct(productId);
    return AjaxResult.success(result);
  }
}
