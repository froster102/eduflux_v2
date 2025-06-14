import { ApplicationException } from '@/application/exceptions/application.exception';
import { AppErrorCode } from '@/shared/errors/error-code';

export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.NOT_FOUND);
    this.name = 'NotFoundException';
  }
}
