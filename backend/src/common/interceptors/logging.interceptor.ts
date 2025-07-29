import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] as string;

    const startTime = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`, {
      method,
      url,
      userAgent,
      requestId,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `Outgoing Response: ${method} ${url} ${response.statusCode} - ${duration}ms`,
            {
              method,
              url,
              statusCode: response.statusCode,
              duration,
              requestId,
            }
          );
        },
        error: error => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `Request Error: ${method} ${url} - ${duration}ms`,
            error.stack,
            {
              method,
              url,
              duration,
              requestId,
              error: error.message,
            }
          );
        },
      })
    );
  }
}
