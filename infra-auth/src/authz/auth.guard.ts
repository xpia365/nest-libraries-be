import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@xpia/infra-exception';

import { IsAnonymousEndpoint } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (IsAnonymousEndpoint(context, this.reflector)) return true;
    const request = context.switchToHttp().getRequest();

    if (request.headers['jwt-validated'] !== 'true') {
      throw new UnauthorizedException('Id does not exist!');
    }

    return true;
  }
}
