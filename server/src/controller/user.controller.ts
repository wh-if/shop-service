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
import { UserService } from 'src/service/user.service';
import {
  UserInsertDTO,
  UserListOrderDTO,
  UserListQueryDTO,
  UserUpdateDTO,
} from 'src/dto/user.dto';
import { AuthService } from 'src/service/auth.service';
import { Public } from 'src/guard/auth.guard';
import { ExpressReqWithUser } from 'src/common/type';
import { Roles } from 'src/guard/role.guard';
import { USER_ROLE } from 'src/common/constant';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('user')
  async getList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('order') order: UserListOrderDTO,
    @Query('query') query: UserListQueryDTO,
  ) {
    const result = await this.userService.getUserList(
      query ?? {},
      order ?? {},
      {
        page,
        pageSize,
      },
    );
    return AjaxResult.success(result);
  }

  /**
   * 更新用户信息
   * @param dto
   * @returns
   */
  @Put('user')
  @Roles([USER_ROLE.USER])
  async update(@Body() dto: UserUpdateDTO, @Req() request: ExpressReqWithUser) {
    // 修改密码、电话时需要验证码
    if (dto.telNumber || dto.password) {
      // 检验验证码
      if (
        !this.authService.checkAuthCode(
          request.userInfo.telNumber,
          dto.authcode,
        )
      ) {
        return AjaxResult.fail('验证码错误或已过期！');
      }
    }

    const result = await this.userService.update(dto, request.userInfo.userId);
    if (typeof result === 'string') {
      return AjaxResult.fail(result);
    }
    return AjaxResult.success(result);
  }

  @Delete('user/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.delete(id);
    return AjaxResult.success(result);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: UserInsertDTO) {
    // 检验验证码
    if (!this.authService.checkAuthCode(dto.telNumber, dto.authcode)) {
      return AjaxResult.fail('验证码错误或已过期！');
    }

    // 注册
    const result = await this.userService.insert(dto);
    return AjaxResult.success(result.identifiers);
  }

  /**
   * 检查手机号是否被注册
   * @param telNumber
   * @returns
   */
  @Public()
  @Get('register/check')
  async checkIfRegister(@Query('telNumber') telNumber: string) {
    const result = await this.userService.findUserInfo(telNumber);
    return AjaxResult.success({ hasRegister: !!result });
  }
}
