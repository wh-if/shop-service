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
  OrderListOrderDTO,
  OrderListQueryDTO,
  OrderStatusChangeDTO,
  OrderPayDTO,
} from 'src/dto/order.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { AuthService } from 'src/service/auth.service';

@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  @Get('order')
  async getOrderList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: OrderListOrderDTO,
    @Query('query') query: OrderListQueryDTO,
  ) {
    const result = await this.orderService.getOrderList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  @Get('order/:id')
  async findOrder(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.findOrderById(id);
    return AjaxResult.success(result);
  }

  @Put('order/status')
  async updateOrderStatus(@Body() dto: OrderStatusChangeDTO) {
    const result = await this.orderService.changeOrderStatus(
      dto.id,
      dto.status,
    );
    return AjaxResult.success(result);
  }

  @Put('order/cancel/:id')
  async cancelStatus(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.cancelOrder(id);

    if (typeof result === 'string') {
      AjaxResult.fail(result);
    } else {
      return AjaxResult.success(result);
    }
  }

  /**
   * 验证码模拟支付
   * @param dto
   * @param request
   * @returns
   */
  @Post('order/pay')
  async payOrder(@Body() dto: OrderPayDTO, @Req() request: ExpressReqWithUser) {
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
  async insertOrder(
    @Body() dto: OrderInsertDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.orderService.insertOrder(
      dto,
      request.userInfo.userId,
    );

    if (typeof result === 'string') {
      return AjaxResult.fail(result);
    } else {
      return AjaxResult.success(result);
    }
  }

  @Delete('order/:id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.deleteOrder(id);
    if (typeof result === 'string') {
      return AjaxResult.fail(result);
    } else {
      return AjaxResult.success(result);
    }
  }
}
