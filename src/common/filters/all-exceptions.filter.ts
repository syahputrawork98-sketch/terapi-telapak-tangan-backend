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

      const message = this.extractMessage(payload, exception.message);
      const errorCode = this.mapErrorCodeByStatus(status);

      response.status(status).json(failure(message, errorCode));
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(failure('Internal server error', 'INTERNAL_ERROR'));
  }

  private mapErrorCodeByStatus(status: number): string {
    if (status === HttpStatus.UNAUTHORIZED) {
      return 'AUTH_UNAUTHORIZED';
    }

    if (status === HttpStatus.FORBIDDEN) {
      return 'AUTH_FORBIDDEN';
    }

    if (status === HttpStatus.NOT_FOUND) {
      return 'RESOURCE_NOT_FOUND';
    }

    if (status === HttpStatus.BAD_REQUEST) {
      return 'VALIDATION_ERROR';
    }

    return 'INTERNAL_ERROR';
  }

  private extractMessage(payload: unknown, fallback: string): string {
    if (typeof payload === 'string') {
      return payload;
    }

    if (typeof payload === 'object' && payload !== null && 'message' in payload) {
      const msg = (payload as { message: unknown }).message;
      if (typeof msg === 'string') {
        return msg;
      }
      if (Array.isArray(msg)) {
        return msg.join(', ');
      }
    }

    return fallback;
  }
}