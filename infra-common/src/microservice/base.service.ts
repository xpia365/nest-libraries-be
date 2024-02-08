import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { v4 } from 'uuid';
import { Logger } from 'winston';
import { BadRequestException, Exception } from '@xpia/infra-exception';

import { MicroserviceRequest } from './request';
import { MicroserviceResponse } from './response';

@Injectable()
export class BaseMicroService {
  @Inject('winston')
  private readonly logger!: Logger;

  public async sendAsync<TInput = unknown, TResult = unknown>(
    client: ClientProxy,
    service: string,
    pattern: string,
    input: TInput,
    keepConnection: boolean = false,
  ): Promise<TResult> {
    const maxRetries = 1;

    let result: MicroserviceResponse<TResult> =
      {} as MicroserviceResponse<TResult>;

    let retry = 0;
    const id = v4();
    do {
      const request = new MicroserviceRequest<TInput>({
        id,
        service,
        pattern,
        input,
      });
      this.logger.info(`Requesting ${pattern} Id: ${id}`);

      // eslint-disable-next-line no-await-in-loop
      result = await lastValueFrom(
        client
          .send(pattern, request)
          .pipe(timeout(60000))
          .pipe(catchError((error) => of(error))),
      );

      if (!keepConnection) {
        client.close();
      }

      this.logger.info(`Finished ${pattern} Id: ${id}`);

      if (result.success) return result.data;

      this.logger.info('Request failed', { result });

      if (!result?.message.includes('ECONNREFUSED')) {
        this.logger.info(`request failed, ${JSON.stringify(result)}`);

        if (result.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
          throw new BadRequestException(result.message);
        }
        throw new Exception(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
          {
            errorMessage: result.message,
            requestId: id,
          },
        );
      }

      // Retry connection
      client.close();
      this.logger.error(
        '[ECONNREFUSED] Connection refused. Attempting to reconnect...',
      );
      if (retry >= maxRetries) {
        this.logger.error('All retry attempts have been exhausted.');
        throw new Exception(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
          {
            errorMessage: result.message,
            requestId: id,
          },
        );
      }

      retry += 1;
    } while (retry <= maxRetries);

    return result.data;
  }
}
