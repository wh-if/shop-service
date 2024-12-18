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
import { ExpressReqWithUser } from 'src/common/type';
import { CollectService } from 'src/service/collect.service';

@Controller('collect')
export class CollectController {
  constructor(private collectService: CollectService) {}

  @Get()
  async getCollectList(@Req() request: ExpressReqWithUser) {
    return AjaxResult.success(
      await this.collectService.getCollectList(request.userInfo.userId),
    );
  }

  @Post('/:productId')
  async addCollect(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.collectService.addCollect(
      request.userInfo.userId,
      productId,
    );
    return result ? AjaxResult.success() : AjaxResult.fail();
  }

  @Delete('/:productId')
  async cancelCollect(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.collectService.cancelCollect(
      request.userInfo.userId,
      productId,
    );
    return result ? AjaxResult.success() : AjaxResult.fail();
  }
}
