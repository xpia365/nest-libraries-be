import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthMiddleware } from './jwt.middleware';

@Global()
@Module({})
export class AuthJwtModule implements NestModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: AuthJwtModule,
      imports: [ConfigModule],
      providers: [JwtService, JwtAuthMiddleware],
      exports: [JwtAuthMiddleware, JwtService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
