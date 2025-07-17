import { AppErrorCode } from '@/shared/error/error-code';
import { ApplicationException } from './application.exception';

export class NotFoundException extends ApplicationException {
  constructor(message: string, publicMessage?: string) {
    super(message, AppErrorCode.NOT_FOUND, publicMessage);
    this.name = 'NotFoundException';
    this.publicMessage = publicMessage;
  }
}
