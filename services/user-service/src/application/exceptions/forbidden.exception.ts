import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class ForbiddenException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.FORBIDDEN);
    this.name = 'ForbiddenException';
  }
}
