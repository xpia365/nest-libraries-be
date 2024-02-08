import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { BULLBOARD_UI_MODULE_PROVIDER } from './bullboard-ui.const';
import { BullBoardUiOptions } from './bullboard-ui.interface';

@Injectable()
export class AuthBullBoardUi implements NestMiddleware {
  constructor(
    @Inject(BULLBOARD_UI_MODULE_PROVIDER)
    private readonly dashboardUiOptions: BullBoardUiOptions,
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
