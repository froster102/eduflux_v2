import { Code } from './Code';
import { Exception } from './Exception';

export class NotFoundException extends Exception<void> {
  constructor(message?: string) {
    super({ codeDescription: Code.NOT_FOUND_ERROR, overrideMessage: message });
    this.name = 'NotFoundException';
  }
}
