import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | object;
  error?: string;
  requestId?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      requestId: request.headers['x-request-id'] as string,
    };

    // Add error details for client errors (4xx)
    if (status >= 400 && status < 500) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        errorResponse.message = exceptionResponse;
      }
    }

    // Log error for server errors (5xx)
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${exception.message}`,
        exception.stack,
        {
          path: request.url,
          method: request.method,
          requestId: errorResponse.requestId,
        }
      );
    }

    response.status(status).json(errorResponse);
  }
}
