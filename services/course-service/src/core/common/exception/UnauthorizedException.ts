import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class UnauthorizedException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: Code.UNAUTHORIZED_ERROR,
      overrideMessage: message,
    });
  }
}
