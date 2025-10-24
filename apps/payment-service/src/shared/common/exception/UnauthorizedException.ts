import { Code } from '@shared/common/error/Code';
import { Exception } from '@shared/common/exception/Exception';

export class UnauthorizedException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: Code.UNAUTHORIZED_ERROR,
      overrideMessage: message,
    });
  }
}
