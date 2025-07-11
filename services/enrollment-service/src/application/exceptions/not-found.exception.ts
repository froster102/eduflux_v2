import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.NOT_FOUND);
    this.name = 'NotFoundException';
  }
}
