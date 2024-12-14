import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AjaxResult } from 'src/common/AjaxResult';
import { LoginDTO } from 'src/dto/user.dto';
import { Public } from 'src/guard/auth.guard';
import { AuthService } from 'src/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * 获取验证码
   * @param key // 电话
   */
  @Public()
  @Get('code')
  getAuthCode(@Query('key') key: string) {
    if (!key) {
      return AjaxResult.fail('参数key不能为空。');
    }
    const code = this.authService.getAuthCode(key);
    return AjaxResult.success('验证码已发送！', { code });
  }

  /**
   * 登录
   * 登出：客户端删除token就行
   * @param dto
   * @returns
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    const result = await this.authService.login(dto);
    if (typeof result === 'string') {
      return AjaxResult.fail(result);
    }

    return AjaxResult.success(result);
  }
}
