export interface HttpResponse<T> {
  message?: string;
  data?: T;
  code?: string;
  path?: string;
  error?: Record<string, any>;
}
