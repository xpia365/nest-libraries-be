import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import Axios, { AxiosRequestConfig } from 'axios';
import {
  AXIOS_INSTANCE_TOKEN,
  HTTP_MODULE_ID,
  HTTP_MODULE_OPTIONS,
} from './http.const';
import { HttpClientService } from './http.service';

export interface AxiosRequestConfigFactory {
  createHttpOptions(): Promise<AxiosRequestConfig> | AxiosRequestConfig;
}

export interface HttpModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AxiosRequestConfigFactory>;
  useClass?: Type<AxiosRequestConfigFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AxiosRequestConfig> | AxiosRequestConfig;
  inject?: any[];
  extraProviders?: Provider[];
}

@Global()
@Module({
  providers: [
    HttpClientService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useValue: Axios,
    },
  ],
  exports: [HttpClientService],
})
export class HttpClientModule {
  static register(config?: AxiosRequestConfig): DynamicModule {
    return {
      module: HttpClientModule,
      providers: [
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useValue: Axios.create(config),
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
    };
  }

  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpClientModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useFactory: (config: AxiosRequestConfig) => Axios.create(config),
          inject: [HTTP_MODULE_OPTIONS],
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
        },
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: HttpModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: HTTP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: HTTP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AxiosRequestConfigFactory) =>
        optionsFactory.createHttpOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
