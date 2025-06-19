import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class FirebaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(FirebaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      this.log(request, status, res, exception.constructor.name);
      response.status(status).json(res);
      return;
    }

    if (exception.code && exception.code.startsWith('auth/')) {
      const status = 401;
      const message = exception.message || 'Authentication error';
      this.log(request, status, message, exception.code);
      response.status(status).json({
        statusCode: status,
        message,
        error: 'Unauthorized',
        code: exception.code,
      });
      return;
    }

    if (exception instanceof Error) {
      const status = 500;
      const message = exception.message || 'Unexpected error';
      this.log(request, status, message, 'ERROR');
      response.status(status).json({
        statusCode: status,
        message,
        error: 'Internal Server Error',
      });
      return;
    }

    const httpError = new InternalServerErrorException(
      exception?.message || 'Unexpected error',
    );

    this.log(
      request,
      httpError.getStatus(),
      httpError.getResponse(),
      exception?.code || 'UNHANDLED_ERROR',
    );
    response.status(httpError.getStatus()).json(httpError.getResponse());
  }

  private log(req: Request, status: number, message: any, code?: string) {
    this.logger.error(
      `[${status}] ${req.method} ${req.originalUrl} | ${code} - ${
        typeof message === 'string' ? message : JSON.stringify(message)
      }`,
    );
  }
}
