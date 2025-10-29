import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

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
