import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export type ExceptionInformation = {
  statusCode: number;
  message: string;
  data?: unknown;
};

export type ExceptionResponse = ExceptionInformation & {
  traceId?: string;
};

export class Exception extends HttpException {
  private readonly customInformation: ExceptionInformation;

  constructor(statusCode: HttpStatus, message: string, data?: unknown) {
    super(message, statusCode);
    this.customInformation = {
      statusCode,
      message,
      data,
    };
  }

  prepareResponse(traceId?: string): ExceptionResponse {
    return {
      ...this.customInformation,
      traceId,
    };
  }
}

type DataError = {
  [key: string]: { [key: string]: string } | null;
};
export class BadRequestException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.BAD_REQUEST, message, data);
  }

  static fromValidationErrors(errors: ValidationError[]): BadRequestException {
    const data: DataError = {};
    const parseErrors = (
      errs: ValidationError[],
      result: DataError,
      parentProperty?: string,
    ): void => {
      errs.forEach((error) => {
        const property = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;
        if (error.constraints) {
          // eslint-disable-next-line no-param-reassign
          result[property] = error.constraints;
        } else if (error.children?.length) {
          parseErrors(error.children, result, property);
        }
      });
    };
    parseErrors(errors, data);

    return new BadRequestException('Validation failed', data);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.UNAUTHORIZED, message, data);
  }
}

export class NotAllowedException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.FORBIDDEN, message, data);
  }
}

export class NotFoundException extends Exception {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.NOT_FOUND, message, data);
  }
}

export class InternalServerError extends Exception {
  constructor(message?: string, data?: unknown) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      message || 'Internal Server Error',
      data,
    );
  }
}

export class ServiceUnavailableServerError extends Exception {
  constructor(message?: string, data?: unknown) {
    super(
      HttpStatus.SERVICE_UNAVAILABLE,
      message || 'Service is not available',
      data,
    );
  }
}

export class NotRouteFoundError extends Exception {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'No Route Found');
  }
}
