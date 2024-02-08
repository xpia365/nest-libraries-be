import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { IAuthenticatedRequest } from './authentication.request';

@Injectable()
export class AuthGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const { userId } = request;
    if (!userId) throw new UnauthorizedException();

    return true;
  }
}
