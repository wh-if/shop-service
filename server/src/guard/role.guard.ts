import { SetMetadata } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from 'src/common/constant';
import { ExpressReqWithUser } from 'src/common/type';

export const ROLES_KEY = 'roles';
export const Roles = (roles: USER_ROLE[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 默认大部分接口都需要admin权限
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [USER_ROLE.ADMIN];

    const { userInfo } = context
      .switchToHttp()
      .getRequest() as ExpressReqWithUser;

    if (!userInfo) {
      // 没有userInfo说明接口是public，不需要权限
      return true;
    }

    return requiredRoles.some((ro) => userInfo.roles.includes(ro));
  }
}
