export interface SuccessEnvelope<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  message: string;
  error_code: string;
  details: Record<string, unknown>;
}
