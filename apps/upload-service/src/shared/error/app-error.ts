import { AppErrorCode } from './error-code';

export class AppError extends Error {
  code: AppErrorCode;
  constructor(message: string, code: AppErrorCode) {
    super(message);
    this.name = this.constructor.name;

    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
