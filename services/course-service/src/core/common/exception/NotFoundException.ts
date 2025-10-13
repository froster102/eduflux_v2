import { Code } from '@core/common/error/Code';
import { Exception } from './Exception';

export class NotFoundException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: {
        code: Code.NOT_FOUND_ERROR.code,
        message: Code.NOT_FOUND_ERROR.message,
      },
      overrideMessage: message,
    });
  }
}
