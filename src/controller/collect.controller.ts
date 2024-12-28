import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { USER_ROLE } from 'src/common/constant';
import { ExpressReqWithUser } from 'src/common/type';
import { Roles } from 'src/guard/role.guard';
import { CollectService } from 'src/service/collect.service';

@Controller('collect')
export class CollectController {
  constructor(private collectService: CollectService) {}

  @Get()
  @Roles([USER_ROLE.USER])
  async getCollectList(@Req() request: ExpressReqWithUser) {
    const result = await this.collectService.getCollectList(
      request.userInfo.userId,
    );
    return AjaxResult.success(result);
  }

  @Post('/:productId')
  @Roles([USER_ROLE.USER])
  async addCollect(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.collectService.addCollect(
      request.userInfo.userId,
      productId,
    );
    return AjaxResult.judge(result);
  }

  @Delete('/:productId')
  @Roles([USER_ROLE.USER])
  async cancelCollect(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.collectService.cancelCollect(
      request.userInfo.userId,
      productId,
    );
    return AjaxResult.judge(result);
  }
}
