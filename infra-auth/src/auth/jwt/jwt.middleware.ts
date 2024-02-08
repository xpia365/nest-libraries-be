import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { IAuthenticatedRequest } from '../authentication.request';
import { AppConstant } from 'src/common/constants';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: IAuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (token) {
      this.jwtService
        .verifyAsync(token, { secret: AppConstant.JWT_SECRET })
        .then((decodedToken: { id: string; role: string }) => {
          if (decodedToken) {
            req.userId = decodedToken.id;
            req.headers['role'] = decodedToken.role;
            req.headers['jwt-validated'] = 'true';
          }
        })
        .finally(() => {
          next();
        });
    } else {
      next();
    }
  }
}
