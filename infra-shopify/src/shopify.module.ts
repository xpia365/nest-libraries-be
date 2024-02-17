import { DynamicModule, Module } from '@nestjs/common';
import { ShopifyController } from './shopify.controller';
import { ShopifyService } from './shopify.service';
import { ShopifyModuleOptions } from './shopify.interface';
import { SHOPIFY_MODULE_PROVIDER } from './shopify.constant';

@Module({
  providers: [],
  controllers: [],
  exports: [],
})
export class ShopifyModule {
  static forRoot(options: ShopifyModuleOptions): DynamicModule {
    return {
      module: ShopifyModule,
      providers: [
        {
          provide: SHOPIFY_MODULE_PROVIDER,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ShopifyService,
      ],
      controllers: [ShopifyController],
      exports: [ShopifyService],
    };
  }
}
