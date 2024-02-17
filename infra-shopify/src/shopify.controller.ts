import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { EventAuthRequest } from './shopify.interface';
import { ShopifyService } from './shopify.service';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get()
  async author(@Query() query: { store: string }, @Res() response) {
    const authServices = await this.shopifyService.author(query.store);

    if (!authServices.status) {
      return response.json(400).json(authServices.message);
    }

    return response.status(200).redirect(authServices.url);
  }

  @Get('/callback')
  async authorCallback(@Req() req: Request, @Res() res: Response) {
    const { shop, hmac, code, state, host, timestamp } = req.query;

    const event: EventAuthRequest = {
      shop: shop?.toString(),
      host: host?.toString(),
      hmac: hmac?.toString(),
      timestamp: timestamp?.toString(),
      code: code?.toString(),
      state: state?.toString(),
    };

    const authCallbackServices =
      await this.shopifyService.authorCallback(event);

    if (!authCallbackServices?.status) {
      return res.json(400).json(authCallbackServices?.message);
    }

    return res.status(200).redirect(authCallbackServices.url);
  }
}
