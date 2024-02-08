import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from 'winston';
import { MicroserviceRequest } from './request';
import { MicroserviceResponse } from './response';

@Injectable()
export class MicroserviceInterceptor implements NestInterceptor {
  @Inject('winston')
  private readonly logger!: Logger;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<MicroserviceResponse<unknown>> {
    const request = context.getArgByIndex<MicroserviceRequest<unknown>>(0);
    const { id, service, pattern } = request;
    this.logger.info(`Handling request: ${pattern} ${id} service: ${service}`);

    return next.handle().pipe(
      map((data) => {
        this.logger.info(
          `Finish request: ${pattern} ${id} service: ${service}`,
        );
        return new MicroserviceResponse({
          success: true,
          data,
        });
      }),
    );
  }
}
