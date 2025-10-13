import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class DatabaseException extends Exception<void> {
  constructor() {
    super({
      codeDescription: {
        code: Code.INTERNAL_ERROR.code,
        message: Code.INTERNAL_ERROR.message,
      },
    });
    this.name = 'DatabaseException';
  }
}
