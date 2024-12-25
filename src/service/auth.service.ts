import { Injectable } from '@nestjs/common';
import { LoginDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { Md5Hash } from 'src/common/util';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/config';

@Injectable()
export class AuthService {
  authCodeMap: Map<string, { code: string; clearTimer: NodeJS.Timeout }>;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.authCodeMap = new Map();
  }

  /**
   * 生成验证码
   * @param key
   * @param length
   */
  getAuthCode(key: string, length = 6) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      captcha += chars[randomIndex];
    }

    const timer = setTimeout(() => {
      this.authCodeMap.delete(key);
    }, AppConfig.auth.authcode_expiresIn * 1000);
    this.authCodeMap.set(key, {
      code: captcha,
      clearTimer: timer,
    });

    // 发送验证码
    return captcha;
  }

  /**
   * 校验验证码
   * @param key
   * @param checkcode
   * @returns
   */
  checkAuthCode(key: string, checkcode: string) {
    const val = this.authCodeMap.get(key);
    if (val && checkcode === val.code) {
      this.authCodeMap.delete(key);
      clearTimeout(val.clearTimer);
      return true;
    }
    return false;
  }

  /**
   * 登录
   * @param key
   * @returns
   */
  async login(dto: LoginDTO) {
    // 获取用户
    const user = await this.userService.findUserInfo(dto.telNumber);

    if (!user) {
      return '用户不存在，请确认手机号正确。';
    }
    const { password, ...userInfo } = user;
    // 登录校验
    if (!!dto.authcode) {
      // 如果存在authcode，优先用它登录
      // 检验验证码
      if (!this.checkAuthCode(dto.telNumber, dto.authcode)) {
        return '验证码错误或已过期！';
      }
    } else {
      // 密码登录
      if (password !== Md5Hash(dto.password)) {
        return '密码错误！';
      }
    }

    // 登录成功
    // 设置最后登录时间
    user.lastLoginTime = new Date();
    await this.userService.update(
      {
        lastLoginTime: user.lastLoginTime,
      },
      user.id,
    );

    const payload = {
      userId: user.id,
      telNumber: user.telNumber,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: AppConfig.auth.access_token_expiresIn,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: AppConfig.auth.refresh_token_expiresIn,
      }),
      userInfo,
    };
  }
}
