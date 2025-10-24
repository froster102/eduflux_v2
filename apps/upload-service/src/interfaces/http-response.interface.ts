export interface HttpResponse<T> {
  message?: string;
  data?: T;
  error?: Record<string, any>;
  code?: string;
  path?: string;
}
