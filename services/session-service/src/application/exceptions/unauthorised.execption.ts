import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class UnauthorizedException extends ApplicationException {
  constructor(message: string, publicMessage?: string) {
    super(message, AppErrorCode.UNAUTHORIZED, publicMessage);
    this.name = 'UnauthorizedException';
    this.publicMessage = publicMessage;
  }
}
