import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class ForbiddenException extends ApplicationException {
  constructor(message: string, publicMessage?: string) {
    super(message, AppErrorCode.FORBIDDEN, publicMessage);
    this.name = 'ForbiddenException';
    this.publicMessage = publicMessage;
  }
}
