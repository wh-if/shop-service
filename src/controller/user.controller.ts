import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { UserService } from 'src/service/user.service';
import {
  UserInsertDTO,
  UserListQueryDTO,
  UserUpdateDTO,
  UserValidator,
} from 'src/dto/user.dto';
import { AuthService } from 'src/service/auth.service';
import { Public } from 'src/guard/auth.guard';
import { ExpressReqWithUser } from 'src/common/type';
import { Roles } from 'src/guard/role.guard';
import { USER_ROLE } from 'src/common/constant';
import { ParseIntPartialPipe } from 'src/pip/ParseIntPartialPipe';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('user')
  async getList(
    @Query('query') query: UserListQueryDTO,
    @Query('page', ParseIntPartialPipe) page?: number,
    @Query('pageSize', ParseIntPartialPipe) pageSize?: number,
  ) {
    const result = await this.userService.getUserList(query ?? {}, {
      page,
      pageSize,
    });
    return AjaxResult.success(result);
  }

  @Get('user/info')
  @Roles([USER_ROLE.USER])
  async getUserInfo(
    @Query('userId') id: string,
    @Req() request: ExpressReqWithUser,
  ) {
    const { userId, roles } = request.userInfo;
    let targetId = userId;

    if (id && roles.includes(USER_ROLE.ADMIN)) {
      targetId = parseInt(id);
      if (isNaN(userId)) {
        throw new BadRequestException(
          'Validation Failed: 用户ID不正确, 请重新确认。',
        );
      }
    }

    const { password, ...result } =
      await this.userService.findUserInfo(targetId);

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
    UserValidator.name.unRequired().check(dto.name);
    UserValidator.authcode.unRequired().check(dto.authcode);
    UserValidator.password.unRequired().check(dto.password);
    UserValidator.telNumber.unRequired().check(dto.telNumber);
    UserValidator.avatar.unRequired().check(dto.avatar);
    UserValidator.id.unRequired().check(dto.id);
    UserValidator.status.unRequired().check(dto.status);
    UserValidator.roles.unRequired().check(dto.roles);

    const userIsAdmin = request.userInfo.roles.includes(USER_ROLE.ADMIN);
    const curUserId = request.userInfo.userId;

    if (dto.roles || dto.status) {
      if (!userIsAdmin) {
        throw new ForbiddenException('修改用户角色和状态需要管理员权限。');
      }
    }

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

    const result = await this.userService.update(
      dto,
      userIsAdmin ? dto.id || curUserId : curUserId,
    );
    return AjaxResult.success(result);
  }

  @Delete('user')
  async delete(@Query('ids') ids: (string | number)[]) {
    try {
      ids = ids.map((id) => parseInt(id as string));
    } catch {
      throw new BadRequestException('Validation Failed: id 不合法');
    }
    const result = await this.userService.delete(ids as number[]);
    return AjaxResult.success(result);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: UserInsertDTO) {
    UserValidator.name.required().check(dto.name);
    UserValidator.authcode.required().check(dto.authcode);
    UserValidator.password.required().check(dto.password);
    UserValidator.telNumber.required().check(dto.telNumber);

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
    UserValidator.telNumber.required().check(telNumber);
    const result = await this.userService.findUserInfo(telNumber);
    return AjaxResult.success({ hasRegister: !!result });
  }
}
