export interface HttpResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
  code?: string;
  path?: string;
}
