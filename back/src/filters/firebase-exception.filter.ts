import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

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
      this.log(request, status, res);
      response.status(status).json(res);
      return;
    }

    const errorMap = {
      PERMISSION_DENIED: () => new ForbiddenException('No permission'),
      USER_NOT_FOUND: () => new NotFoundException('User not found'),
      INSUFFICIENT_FUNDS: () => new BadRequestException('Insufficient funds'),
      INVALID_AMOUNT: () => new UnprocessableEntityException('Invalid amount'),
    };

    const fallback = () =>
      new InternalServerErrorException(
        exception?.message || 'Unexpected error',
      );

    const exceptionFactory = errorMap[exception?.code] || fallback;
    const httpError = exceptionFactory();

    this.log(
      request,
      httpError.getStatus(),
      httpError.getResponse(),
      exception?.code,
    );
    response.status(httpError.getStatus()).json(httpError.getResponse());
  }

  private log(req: Request, status: number, message: any, code?: string) {
    this.logger.error(
      `[${status}] ${req.method} ${req.originalUrl} | ${code ?? 'UNHANDLED'} - ${
        typeof message === 'string' ? message : JSON.stringify(message)
      }`,
    );
  }
}
