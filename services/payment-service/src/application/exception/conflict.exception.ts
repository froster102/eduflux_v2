import { AppErrorCode } from '@/shared/error/error-code';
import { ApplicationException } from './application.exception';

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.CONFLICT);
    this.name = 'ConflictException';
  }
}
