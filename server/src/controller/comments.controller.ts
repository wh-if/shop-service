import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { CommentsService } from 'src/service/comments.service';
import {
  CommentsInsertDTO,
  CommentsUpdateDTO,
  CommentsListOrderDTO,
  CommentsListQueryDTO,
} from 'src/dto/comments.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { UserService } from 'src/service/user.service';
import { USER_ROLE } from 'src/common/constant';

@Controller()
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
  ) {}

  @Get('comments')
  async getCommentsList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: CommentsListOrderDTO,
    @Query('query') query: CommentsListQueryDTO,
  ) {
    const result = await this.commentsService.getCommentsList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  @Get('comments/:id')
  async findComments(@Param('id', ParseIntPipe) id: number) {
    const result = await this.commentsService.findCommentsById(id);
    return AjaxResult.success(result);
  }

  @Put('comments')
  async updateComments(
    @Body() dto: CommentsUpdateDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    const user = await this.userService.findUserInfo(request.userInfo.userId);
    if (dto.status && user.role !== USER_ROLE.ADMIN) {
      throw new ForbiddenException('当前用户无权修改评论状态');
    }

    const result = await this.commentsService.updateComments(dto);
    return AjaxResult.success(result);
  }

  @Post('comments')
  async insertComments(
    @Body() dto: CommentsInsertDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    const result = await this.commentsService.insertComments(
      dto,
      request.userInfo.userId,
    );
    return AjaxResult.success(result.identifiers);
  }

  @Delete('comments/:id')
  async deleteComments(@Param('id', ParseIntPipe) id: number) {
    const result = await this.commentsService.deleteComments(id);
    return AjaxResult.success(result);
  }
}
