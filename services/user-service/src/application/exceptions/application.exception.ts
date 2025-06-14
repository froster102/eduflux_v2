import { BaseException } from '@/shared/exceptions/base.exception';
import { AppErrorCode } from '@/shared/errors/error-code';

export class ApplicationException extends BaseException {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
