import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { TokenPayload } from 'src/common/type';
import { AjaxResult } from 'src/common/AjaxResult';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: AppConfig.auth.jwt_secret,
      });
      request['userInfo'] = payload;
    } catch {
      if (!isPublic) {
        if (request.path === '/auth/token') {
          throw new UnauthorizedException();
        } else {
          throw new HttpException(
            new AjaxResult(2, '使用 refresh_token 刷新 token', null),
            HttpStatus.OK,
          );
        }
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
