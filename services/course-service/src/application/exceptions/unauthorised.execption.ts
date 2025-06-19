import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class UnauthorizedException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.UNAUTHORIZED);
    this.name = 'UnauthorizedException';
  }
}
