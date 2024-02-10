import {
  Global,
  DynamicModule,
  Module,
  NestModule,
  MiddlewareConsumer,
  Inject,
  Provider,
} from '@nestjs/common';
import { PromModuleOptions } from './interfaces';
import {
  DEFAULT_PROM_REGISTRY,
  PROM_REGISTRY_NAME,
  DEFAULT_PROM_OPTIONS,
} from './common/prom.constants';

import client from 'prom-client';
import {
  Registry,
  collectDefaultMetrics,
  DefaultMetricsCollectorConfiguration,
} from 'prom-client';
import { getRegistryName } from './common/prom.utils';
import { InboundMiddleware } from './middleware';
import { PromService } from './prom.service';
import { PromController } from './prom.controller';

@Global()
@Module({})
export class PromModule implements NestModule {
  constructor(
    @Inject(DEFAULT_PROM_OPTIONS) private readonly options: PromModuleOptions,
  ) {}

  static forRoot(options: PromModuleOptions = {}): DynamicModule {
    const { withDefaultsMetrics, registryName, prefix, pushgateway } = options;

    const promRegistryName = registryName
      ? getRegistryName(registryName)
      : DEFAULT_PROM_REGISTRY;

    const providers: Provider[] = [
      {
        provide: PROM_REGISTRY_NAME,
        useValue: promRegistryName,
      },
      {
        provide: DEFAULT_PROM_OPTIONS,
        useValue: options,
      },
      PromService,
    ];

    const registryProvider = {
      provide: promRegistryName,
      useFactory: (): Registry => {
        let registry = client.register;
        if (promRegistryName !== DEFAULT_PROM_REGISTRY) {
          registry = new Registry();
        }

        // clear here for HMR support
        registry.clear();

        if (options.defaultLabels) {
          registry.setDefaultLabels(options.defaultLabels);
        }

        if (withDefaultsMetrics !== false) {
          const defaultMetricsOptions: DefaultMetricsCollectorConfiguration<client.RegistryContentType> =
            {
              register: registry,
            };
          if (prefix) {
            defaultMetricsOptions.prefix = prefix;
          }
          collectDefaultMetrics(defaultMetricsOptions);
        }

        return registry;
      },
    };

    if (pushgateway !== undefined) {
      const { url, options: gatewayOptions } = options.pushgateway;
      providers.push({
        provide: client.Pushgateway,
        useValue: PromModule.configurePushgateway(url, gatewayOptions),
      });
    }

    providers.push(registryProvider);

    return {
      module: PromModule,
      providers,
      controllers: [PromController.forRoot()],
      exports: [registryProvider, PromService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.options.withHttpMiddleware?.enable === true) {
      consumer.apply(InboundMiddleware).forRoutes('*');
    }
  }

  private static configurePushgateway<T extends client.RegistryContentType>(
    url: string,
    options?: unknown,
    registry?: client.Registry,
  ): client.Pushgateway<T> {
    return new client.Pushgateway(url, options, registry);
  }
}
