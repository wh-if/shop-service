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
import { CommentsService } from 'src/service/comments.service';
import {
  CommentsInsertDTO,
  CommentsUpdateDTO,
  CommentsListQueryDTO,
  CommentsValidator,
  CommentsUpdateStatusDTO,
} from 'src/dto/comments.dto';
import { ExpressReqWithUser } from 'src/common/type';
import { USER_ROLE } from 'src/common/constant';
import { Public } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role.guard';
import { ParseIntPartialPipe } from 'src/pip/ParseIntPartialPipe';

@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('comments')
  @Public()
  async getCommentsList(
    @Query('query') query: CommentsListQueryDTO,
    @Query('page', ParseIntPartialPipe) page?: number,
    @Query('pageSize', ParseIntPartialPipe) pageSize?: number,
  ) {
    const result = await this.commentsService.getCommentsList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('comments/:id')
  async findComments(@Param('id', ParseIntPipe) id: number) {
    const result = await this.commentsService.findCommentsById(id);
    return AjaxResult.success(result);
  }

  @Put('comments')
  @Roles([USER_ROLE.USER])
  async updateComments(@Body() dto: CommentsUpdateDTO) {
    CommentsValidator.id.required().check(dto.id);
    CommentsValidator.star.unRequired().check(dto.star);
    CommentsValidator.pictures.unRequired().check(dto.pictures);
    CommentsValidator.content.unRequired().check(dto.content);

    const result = await this.commentsService.updateComments(dto);
    return AjaxResult.success(result);
  }

  @Post('comments')
  @Roles([USER_ROLE.USER])
  async insertComments(
    @Body() dto: CommentsInsertDTO,
    @Req() request: ExpressReqWithUser,
  ) {
    CommentsValidator.orderId.required().check(dto.orderId);
    CommentsValidator.parentId.required().check(dto.parentId);
    CommentsValidator.star.required().check(dto.star);
    CommentsValidator.pictures.required().check(dto.pictures);
    CommentsValidator.content.required().check(dto.content);

    const result = await this.commentsService.insertComments(
      dto,
      request.userInfo.userId,
    );
    return AjaxResult.success(result.identifiers);
  }

  @Delete('comments')
  @Roles([USER_ROLE.USER])
  async deleteComments(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.commentsService.deleteComments(ids as number[]);
    return AjaxResult.success(result);
  }

  @Put('comments/status')
  async updateCommentsStatus(@Body() dto: CommentsUpdateStatusDTO) {
    CommentsValidator.status.required().check(dto.status);
    CommentsValidator.ids.required().check(dto.ids);

    const result = await this.commentsService.updateCommentsStatus(
      dto.ids,
      dto.status,
    );
    return AjaxResult.success(result);
  }
}
