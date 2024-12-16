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
import { RequestWithUserInfo } from 'src/common/type';

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
    if (page && pageSize) {
      return AjaxResult.success(
        await this.userService.getUserList(query ?? {}, order ?? {}, {
          page,
          pageSize,
        }),
      );
    } else {
      return AjaxResult.fail('参数不能为空');
    }
  }

  /**
   * 更新用户信息
   * @param dto
   * @returns
   */
  @Put('user/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UserUpdateDTO,
    @Req() request: RequestWithUserInfo,
  ) {
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

    const result = await this.userService.update(dto, id);
    if (typeof result === 'string') {
      return AjaxResult.fail(result);
    }
    return AjaxResult.success(result);
  }

  @Delete('user/:id')
  async delete(@Param('id') id: number) {
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
   * @param key
   * @returns
   */
  @Public()
  @Get('register/check')
  async checkIfRegister(@Query('key') key: string) {
    const result = await this.userService.findUserInfo(key, 'telNumber');
    return AjaxResult.success({ hasRegister: !!result });
  }
}
