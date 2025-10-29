import { Code } from './Code';
import { Exception } from './Exception';

export class ForbiddenException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.FORBIDDEN_ERROR, overrideMessage: message });
    this.name = 'ForbiddenException';
  }
}
