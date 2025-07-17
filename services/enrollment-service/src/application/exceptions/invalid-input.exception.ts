import { AppErrorCode } from '@/shared/errors/error-code';
import { ApplicationException } from './application.exception';

export class InvalidInputException extends ApplicationException {
  constructor(message: string, publicMessage?: string) {
    super(message, AppErrorCode.INVALID_INPUT, publicMessage);
    this.name = 'InvalidInputException';
    this.publicMessage = publicMessage;
  }
}
