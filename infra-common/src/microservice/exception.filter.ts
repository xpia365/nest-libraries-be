import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Logger } from 'winston';
import { MicroserviceResponse } from './response';
import { MicroserviceRequest } from './request';

@Catch()
export class HandleExceptionFilter implements ExceptionFilter {
  @Inject('winston')
  private readonly logger!: Logger;

  catch(exception: Error, host: ArgumentsHost): Observable<unknown> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<MicroserviceRequest<any>>();
    this.logger.error(
      `Exception throw from request with pattern: ${request.pattern} - id: ${request.id} - service: ${request.service}`,
    );
    this.logger.error(exception.message, exception);
    return of(
      new MicroserviceResponse({
        success: false,
        message: exception.message,
        statusCode:
          exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR,
      }),
    );
  }
}
