import { Code } from './Code';
import { Exception } from './Exception';

export class InvalidInputException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.VALIDATION_ERROR, overrideMessage: message });
    this.name = 'InvalidInputException';
  }
}
