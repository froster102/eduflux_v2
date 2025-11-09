import { Code } from './Code';
import { Exception } from './Exception';

export class ConflictException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.CONFLICT_ERROR, overrideMessage: message });
    this.name = 'ConflictException';
  }
}
