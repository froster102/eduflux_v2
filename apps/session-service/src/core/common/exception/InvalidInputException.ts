import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class InvalidInputException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.VALIDATION_ERROR, overrideMessage: message });
    this.name = 'InvalidInputException';
  }
}
