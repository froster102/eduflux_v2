import { ApplicationException } from '@/application/exceptions/application.exception';
import { AppErrorCode } from '@/shared/errors/error-code';

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.CONFLICT);
    this.name = 'ConflictException';
  }
}
