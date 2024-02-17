import { Inject, Injectable } from '@nestjs/common';
import nonce from 'nonce';
import Shopify = require('shopify-api-node');
import { HttpClientService } from '@xpia/infra-http';
import crypto = require('crypto');
import queryString = require('querystring');
const jwt = require('jsonwebtoken');

import {
  AuthorizationResponse,
  CallbackResponse,
  EventAuthRequest,
  ShopifyOptions,
} from './shopify.interface';
import { SHOPIFY_MODULE_PROVIDER } from './shopify.constant';

@Injectable()
export class ShopifyService {
  constructor(
    @Inject(SHOPIFY_MODULE_PROVIDER) private readonly options: ShopifyOptions,
    private readonly httpClientService: HttpClientService,
  ) {}

  async author(shop: string): Promise<CallbackResponse> {
    const { redirect_url, client_id, scopes } = this.options;

    if (!shop) {
      return {
        status: false,
        message: 'Missing Shop Name parameter!!',
      };
    }

    const state = nonce();
    const redirectURL = `${redirect_url}/shopify/callback`;

    const installUrl =
      'https://' +
      shop +
      '/admin/oauth/authorize?client_id=' +
      client_id +
      '&scope=' +
      scopes +
      '&state=' +
      state +
      '&redirect_uri=' +
      redirectURL;

    return {
      status: true,
      message: 'success',
      url: installUrl,
    };
  }

  async authorCallback(event: EventAuthRequest): Promise<CallbackResponse> {
    const { shop, hmac, code, state } = event;
    const { client_id, client_secret } = this.options;

    try {
      if (shop && hmac && code) {
        const map = Object.assign({}, { shop, code, state, hmac });
        delete map.hmac;

        const message = queryString.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
          crypto
            .createHmac('sha256', client_secret)
            .update(message)
            .digest('hex'),
          'utf-8',
        );
        let hashEquals = false;

        try {
          hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
        } catch (e) {
          hashEquals = false;
        }

        // delete cookie browser if running
        if (!hashEquals) {
          //   return {
          //     status: false,
          //     url: null,
          //     message: 'HMAC validation failed',
          //   };
        }

        const resp = await this.httpClientService.post(
          `https://${event.shop}/admin/oauth/access_token`,
          { client_id, client_secret, code },
          {
            headers: {
              'content-type': 'application/json',
            },
          },
        );

        const shopify = new Shopify({
          shopName: event.shop,
          accessToken: resp.data.access_token,
        });

        return shopify.shop.get().then(() => {
          return {
            status: true,
            url: `https://${event.shop}/admin/apps/${client_id}`,
          };
        });
      }
    } catch (error) {
      return {
        status: false,
        message: error,
        url: null,
      };
    }
  }

  async verifySessionToken(
    authorization: string,
  ): Promise<AuthorizationResponse> {
    if (!authorization) {
      return {
        status: false,
        token: null,
        message: 'Unauthorized',
      };
    }

    const token: string = authorization.split(' ')[1];
    const decoded = jwt.verify(token, this.options.client_secret);

    if (!decoded) {
      return {
        status: false,
        token: null,
        message: 'Unauthorized',
      };
    }

    return {
      status: true,
      token,
      message: 'Ok',
    };
  }
}
