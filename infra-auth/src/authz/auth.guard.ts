import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IsAnonymousEndpoint } from './index';
import { UnauthorizedException } from 'src/exception';

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
