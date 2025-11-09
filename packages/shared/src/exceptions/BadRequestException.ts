import { Code } from '@shared/exceptions/Code';
import { Exception } from './Exception';

export class BadRequestException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: {
        code: Code.BAD_REQUEST_ERROR.code,
        message: Code.BAD_REQUEST_ERROR.message,
      },
      overrideMessage: message,
    });
  }
}
