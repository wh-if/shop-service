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
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { CouponService } from 'src/service/coupon.service';
import {
  CouponInsertDTO,
  CouponUpdateDTO,
  CouponListQueryDTO,
} from 'src/dto/coupon.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { Public } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role.guard';
import { USER_ROLE } from 'src/common/constant';

@Controller()
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get('coupon')
  @Public()
  async getCouponList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('query') query: CouponListQueryDTO,
  ) {
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
    const result = await this.couponService.updateCoupon(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Post('coupon')
  async insertCoupon(@Body() dto: CouponInsertDTO) {
    const result = await this.couponService.insertCoupon(dto);
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Delete('coupon')
  async deleteCoupon(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    await this.couponService.deleteCoupon(ids as number[]);
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
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  // 我的优惠券列表(未使用的)
  @Get('receive_coupon/me')
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
