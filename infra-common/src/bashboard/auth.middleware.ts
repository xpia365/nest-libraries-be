import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { DASHBOARD_MODULE_PROVIDER } from './dashboard.const';
import { DashboardOptions } from './dashboard.interface';

@Injectable()
export class AuthDashboard implements NestMiddleware {
  constructor(
    @Inject(DASHBOARD_MODULE_PROVIDER)
    private readonly dashboardUiOptions: DashboardOptions,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { path, routes, username, password, secret } =
      this.dashboardUiOptions;

    if (req.body.username === username && req.body.password === password) {
      res.cookie(username, secret, { signed: true });
      res.redirect(routes);
    } else if (req.signedCookies && req.signedCookies[username]) {
      next();
    } else {
      res.render(path);
    }
  }
}
