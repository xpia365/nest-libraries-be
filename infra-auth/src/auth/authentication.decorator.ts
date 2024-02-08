import { createParamDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

import { AuthenticationData } from './authentication.data';
import { IAuthenticatedRequest } from './authentication.request';

// tslint:disable-next-line:variable-name
export const Auth = createParamDecorator(
  (data: any, req: IAuthenticatedRequest): AuthenticationData => {
    return new AuthenticationData(req.userId);
  },
);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
