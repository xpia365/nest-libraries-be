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
  static forRootAsync(): DynamicModule {
    return {
      global: true,
      module: AuthJwtModule,
      imports: [ConfigModule],
      providers: [JwtService, JwtAuthMiddleware],
      exports: [JwtAuthMiddleware, JwtService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    // Apply JwtAuthMiddleware globally
    consumer.apply(JwtAuthMiddleware).forRoutes('*');
  }
}
