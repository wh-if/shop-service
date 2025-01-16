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
import { OrderService } from 'src/service/order.service';
import {
  OrderInsertDTO,
  OrderListQueryDTO,
  OrderStatusChangeDTO,
  OrderPayDTO,
  OrderValidator,
  OrderDetailValidator,
} from 'src/dto/order.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { AuthService } from 'src/service/auth.service';
import { ORDER_STATUS, USER_ROLE } from 'src/common/constant';
import { Roles } from 'src/guard/role.guard';
import { ParseIntArrayPipe } from 'src/pip/ParseIntPipe';
import { Validator } from 'src/common/validator';

@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  @Get('order')
  @Roles([USER_ROLE.USER])
  async getOrderList(
    @Query('query') query: OrderListQueryDTO = {},
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    Validator.validate('ids').array('number').unRequired().check(query.ids);
    const result = await this.orderService.getOrderList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('order/:id')
  @Roles([USER_ROLE.USER])
  async findOrder(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.findOrderById(id);
    return AjaxResult.success(result);
  }

  @Put('order/status')
  async updateOrderStatus(@Body() dto: OrderStatusChangeDTO) {
    OrderValidator.ids.required().check(dto.ids);
    OrderValidator.status.required().check(dto.status);

    const result = await this.orderService.changeOrderStatus(
      dto.ids,
      dto.status,
    );
    return AjaxResult.success(result);
  }

  @Put('order/cancel/:orderId')
  @Roles([USER_ROLE.USER])
  async cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.orderService.cancelOrRemoveOrder(
      orderId,
      ORDER_STATUS.CANCEL,
      request.userInfo.userId,
    );

    return AjaxResult.judge(result);
  }

  /** 普通用户操作订单只做状态改变 */
  @Put('order/remove/:orderId')
  @Roles([USER_ROLE.USER])
  async removeOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.orderService.cancelOrRemoveOrder(
      orderId,
      ORDER_STATUS.REMOVED,
      request.userInfo.userId,
    );

    return AjaxResult.judge(result);
  }

  /**
   * 验证码模拟支付
   * @param dto
   * @param request
   * @returns
   */
  @Post('order/pay')
  @Roles([USER_ROLE.USER])
  async payOrder(@Body() dto: OrderPayDTO, @Req() request: ExpressReqWithUser) {
    OrderValidator.id.required().check(dto.id);
    OrderValidator.payType.required().check(dto.payType);

    // 检验验证码
    if (
      !this.authService.checkAuthCode(request.userInfo.telNumber, dto.authcode)
    ) {
      return AjaxResult.fail('支付失败，验证码错误！');
    }
    const result = await this.orderService.payOrder(dto.id, dto.payType);
    return result ? AjaxResult.success(result) : AjaxResult.fail('支付失败！');
  }

  @Post('order')
  @Roles([USER_ROLE.USER])
  async insertOrder(
    @Body() dto: OrderInsertDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    if (dto.items.length < 1) {
      return AjaxResult.fail('订单创建失败，订单项目不能为空！');
    }

    OrderValidator.orderType.required().check(dto.orderType);
    OrderValidator.note.required().check(dto.note);
    OrderValidator.couponIds.required().check(dto.couponIds);
    OrderValidator.expectTime.required().check(dto.expectTime);
    dto.items.forEach((item) => {
      OrderDetailValidator.chooseOption.required().check(item.chooseOption);
      OrderDetailValidator.quantity.required().check(item.quantity);
      OrderDetailValidator.targetId.required().check(item.targetId);
      OrderDetailValidator.type.required().check(item.type);
    });

    const result = await this.orderService.insertOrder(
      dto,
      request.userInfo.userId,
    );

    return AjaxResult.judge(result);
  }

  @Delete('order')
  @Roles([USER_ROLE.USER])
  async deleteOrder(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    const result = await this.orderService.deleteOrder(ids);

    const restIds = (ids as number[]).filter((i) => !result.includes(i));

    if (restIds.length > 0) {
      return AjaxResult.fail(
        `订单 ${restIds.toString()} 删除失败！请确认订单状态为完成、取消或移除，之后再重新操作！`,
      );
    }

    return AjaxResult.success('删除成功！');
  }
}
