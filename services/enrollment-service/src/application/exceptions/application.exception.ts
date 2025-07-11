import { AppErrorCode } from '@/shared/errors/error-code';
import { BaseException } from '@/shared/exception/base.exception';

export class ApplicationException extends BaseException {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
