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
  CouponListQueryDTO,
  CouponValidator,
} from 'src/dto/coupon.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { Public } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role.guard';
import { USER_ROLE } from 'src/common/constant';
import { ParseIntArrayPipe } from 'src/pip/ParseIntPipe';
import { Validator } from 'src/common/validator';

@Controller()
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get('coupon')
  @Public()
  async getCouponList(
    @Query('query') query: CouponListQueryDTO = {},
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    Validator.validate('ids').array('number').unRequired().check(query.ids);
    const result = await this.couponService.getCouponList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('coupon/:id')
  async findCoupon(@Param('id', ParseIntPipe) id: number) {
    const result = await this.couponService.findCouponById(id);
    return AjaxResult.success(result);
  }

  @Put('coupon')
  async updateCoupon(@Body() dto: CouponUpdateDTO) {
    CouponValidator.id.required().check(dto.id);
    CouponValidator.type.unRequired().check(dto.type);
    CouponValidator.needFull.unRequired().check(dto.needFull);
    CouponValidator.amount.unRequired().check(dto.amount);
    CouponValidator.receiveLimit.unRequired().check(dto.receiveLimit);
    CouponValidator.target.unRequired().check(dto.target);
    CouponValidator.totalQuantity.unRequired().check(dto.totalQuantity);
    CouponValidator.remainingQuantity.unRequired().check(dto.remainingQuantity);
    CouponValidator.status.unRequired().check(dto.status);
    CouponValidator.description.unRequired().check(dto.description);
    CouponValidator.productIds.unRequired().check(dto.productIds);
    CouponValidator.startDate.unRequired().check(dto.startDate);
    CouponValidator.endDate.unRequired().check(dto.endDate);
    const result = await this.couponService.updateCoupon(dto);
    return AjaxResult.judge(result);
  }

  @Post('coupon')
  async insertCoupon(@Body() dto: CouponInsertDTO) {
    CouponValidator.type.required().check(dto.type);
    CouponValidator.needFull.required().check(dto.needFull);
    CouponValidator.amount.required().check(dto.amount);
    CouponValidator.receiveLimit.required().check(dto.receiveLimit);
    CouponValidator.target.required().check(dto.target);
    CouponValidator.totalQuantity.required().check(dto.totalQuantity);
    CouponValidator.remainingQuantity.required().check(dto.remainingQuantity);
    CouponValidator.status.required().check(dto.status);
    CouponValidator.description.required().check(dto.description);
    CouponValidator.productIds.required().check(dto.productIds);
    CouponValidator.startDate.required().check(dto.startDate);
    CouponValidator.endDate.required().check(dto.endDate);
    const result = await this.couponService.insertCoupon(dto);
    return AjaxResult.judge(result);
  }

  @Delete('coupon')
  async deleteCoupon(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    await this.couponService.deleteCoupon(ids);
    return AjaxResult.success();
  }

  // 领取优惠券
  @Post('receive_coupon')
  @Roles([USER_ROLE.USER])
  async receiveCoupon(
    @Query('couponId', ParseIntPipe) couponId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.couponService.receiveCoupon(
      request.userInfo.userId,
      couponId,
    );
    return AjaxResult.judge(result);
  }

  // 获取用户的优惠券列表
  @Get('receive_coupon')
  @Roles([USER_ROLE.USER])
  async getCouponsByUser(@Req() request: ExpressReqWithUser) {
    const result = await this.couponService.getCouponsByUser(
      request.userInfo.userId,
    );
    return AjaxResult.success(result);
  }

  // 产品的可用优惠券
  @Get('product_coupon/:productId')
  @Public()
  async getCouponsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const result = await this.couponService.getCouponsByProduct(productId);
    return AjaxResult.success(result);
  }
}
