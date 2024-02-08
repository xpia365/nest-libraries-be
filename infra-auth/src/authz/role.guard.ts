import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IsAnonymousEndpoint } from './index';
import { UnauthorizedException } from 'src/exception';

export function RoleGuard(role: string): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (IsAnonymousEndpoint(context, this.reflector)) return true;
      const request = context.switchToHttp().getRequest();
      const headerRoles = request.headers['role'];

      if (!headerRoles) {
        throw new UnauthorizedException(
          'Endpoint requires nest role to execute',
        );
      }

      if (role === headerRoles) {
        return true;
      }

      throw new UnauthorizedException('Endpoint requires nest role to execute');
    }
  }
  return mixin(RoleGuardMixin);
}
