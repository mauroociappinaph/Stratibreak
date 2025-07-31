import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;

      // Handle specific error patterns
      if (message.includes('not found')) {
        status = HttpStatus.NOT_FOUND;
      } else if (
        message.includes('validation') ||
        message.includes('invalid')
      ) {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      requestId: request.headers['x-request-id'] as string,
    };

    // Log all unhandled exceptions
    this.logger.error(
      `Unhandled exception: ${message}`,
      exception instanceof Error ? exception.stack : exception,
      {
        path: request.url,
        method: request.method,
        requestId: errorResponse.requestId,
      }
    );

    response.status(status).json(errorResponse);
  }
}
