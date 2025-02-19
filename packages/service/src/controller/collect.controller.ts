import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { USER_ROLE } from 'src/common/constant';
import { ExpressReqWithUser } from 'src/common/type';
import { CollectInsertDTO, CollectValidator } from 'src/dto/collect.dto';
import { Roles } from 'src/guard/role.guard';
import { ParseIntArrayPipe } from 'src/pip/ParseIntPipe';
import { CollectService } from 'src/service/collect.service';

@Controller('collect')
export class CollectController {
  constructor(private collectService: CollectService) {}

  @Get()
  @Roles([USER_ROLE.USER])
  async getCollectList(
    @Req() request: ExpressReqWithUser,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ) {
    const result = await this.collectService.getCollectList(
      request.userInfo.userId,
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  // 添加收藏
  @Post()
  @Roles([USER_ROLE.USER])
  async addCollect(
    @Body() dto: CollectInsertDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    CollectValidator.targetId.required().check(dto.targetId);
    CollectValidator.targetType.required().check(dto.targetType);
    const result = await this.collectService.addCollect(
      request.userInfo.userId,
      dto,
    );
    return AjaxResult.judge(result);
  }

  // 取消收藏
  @Delete()
  @Roles([USER_ROLE.USER])
  async cancelCollect(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    const result = await this.collectService.cancelCollect(ids);
    return AjaxResult.judge(result);
  }
}
