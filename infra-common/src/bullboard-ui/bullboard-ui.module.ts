import {
  Module,
  MiddlewareConsumer,
  DynamicModule,
  Global,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import { AuthBullBoardUi } from './auth.middleware';
import { BULLBOARD_UI_MODULE_PROVIDER } from './bullboard-ui.const';
import {
  BullBoardUiModuleAsyncOptions,
  BullBoardUiOptions,
} from './bullboard-ui.interface';

@Global()
@Module({})
export class BullBoardUiModule {
  static dynamicRoute: string;

  public static register(options: BullBoardUiOptions): DynamicModule {
    this.dynamicRoute = options.routes;

    return {
      module: BullBoardUiModule,
      providers: [
        { provide: BULLBOARD_UI_MODULE_PROVIDER, useValue: options },
        AuthBullBoardUi,
      ],
      exports: [AuthBullBoardUi],
    };
  }

  public static forRootAsync(
    options: BullBoardUiModuleAsyncOptions,
  ): DynamicModule {
    return {
      imports: [
        BullBoardModule.forRoot({
          route: options.routes,
          adapter: ExpressAdapter,
        }),
      ],
      module: BullBoardUiModule,
      providers: [
        {
          provide: BULLBOARD_UI_MODULE_PROVIDER,
          useFactory: async (configService: ConfigService) => {
            const config = await options.useFactory(configService);
            this.dynamicRoute = config.routes;
            return config;
          },
          inject: options.inject || [],
        },
        AuthBullBoardUi,
      ],
      exports: [AuthBullBoardUi],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthBullBoardUi)
      .forRoutes(`${this.constructor['dynamicRoute']}*`);
  }
}
