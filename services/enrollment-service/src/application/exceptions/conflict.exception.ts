import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class ConflictException extends ApplicationException {
  constructor(message: string, publicMessage?: string) {
    super(message, AppErrorCode.CONFLICT, publicMessage);
    this.name = 'ConflictException';
    this.publicMessage = publicMessage;
  }
}
