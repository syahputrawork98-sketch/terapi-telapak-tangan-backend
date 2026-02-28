import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { failure } from '../utils/envelope';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'object' && payload !== null && 'error_code' in payload) {
        response.status(status).json(payload);
        return;
      }

      response
        .status(status)
        .json(failure(exception.message, status === HttpStatus.UNAUTHORIZED ? 'AUTH_UNAUTHORIZED' : 'INTERNAL_ERROR'));
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(failure('Internal server error', 'INTERNAL_ERROR'));
  }
}
