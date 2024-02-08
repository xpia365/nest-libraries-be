import {
  Module,
  MiddlewareConsumer,
  DynamicModule,
  Global,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthDashboard } from './auth.middleware';
import { DASHBOARD_MODULE_PROVIDER } from './dashboard.const';
import {
  DashboardModuleAsyncOptions,
  DashboardOptions,
} from './dashboard.interface';

@Global()
@Module({})
export class DashboardModule {
  static dynamicRoute: string;

  public static register(options: DashboardOptions): DynamicModule {
    this.dynamicRoute = options.routes;

    return {
      module: DashboardModule,
      providers: [
        { provide: DASHBOARD_MODULE_PROVIDER, useValue: options },
        AuthDashboard,
      ],
      exports: [AuthDashboard],
    };
  }

  public static forRootAsync(
    options: DashboardModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: DashboardModule,
      providers: [
        {
          provide: DASHBOARD_MODULE_PROVIDER,
          useFactory: async (configService: ConfigService) => {
            const config = await options.useFactory(configService);
            this.dynamicRoute = config.routes;
            return config;
          },
          inject: options.inject || [],
        },
        AuthDashboard,
      ],
      exports: [AuthDashboard],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthDashboard)
      .forRoutes(`${this.constructor['dynamicRoute']}*`);
  }
}
