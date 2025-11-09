import { Code } from './Code';
import { Exception } from './Exception';

export class UnauthorizedException extends Exception<void> {
  constructor(message?: string) {
    super({
      codeDescription: Code.UNAUTHORIZED_ERROR,
      overrideMessage: message,
    });
  }
}
