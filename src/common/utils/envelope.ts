import { ErrorEnvelope, SuccessEnvelope } from '../interfaces/envelope.interface';

export function success<T>(message: string, data: T): SuccessEnvelope<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function failure(
  message: string,
  errorCode: string,
  details: Record<string, unknown> = {},
): ErrorEnvelope {
  return {
    success: false,
    message,
    error_code: errorCode,
    details,
  };
}
