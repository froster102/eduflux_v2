import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class InvalidInputException extends ApplicationException {
  constructor(message: string) {
    super(message, AppErrorCode.INVALID_INPUT);
    this.name = 'InvalidInputException';
  }
}
