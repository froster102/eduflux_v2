import { Code } from '@core/common/error/Code';
import { Exception } from './Exception';

export class InvalidInputException extends Exception<void> {
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
