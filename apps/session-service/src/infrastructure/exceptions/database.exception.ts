import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class DatabaseException extends Exception<void> {
  constructor() {
    super({ codeDescription: Code.INTERNAL_ERROR });
    this.name = 'DatabaseException';
  }
}
