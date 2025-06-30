import { AppErrorCode } from '../errors/error-code';

export class AppException extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
