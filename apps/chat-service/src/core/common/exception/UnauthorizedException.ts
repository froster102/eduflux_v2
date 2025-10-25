import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class UnauthorizedException extends Exception<{ userId: string }> {
  constructor(userId: string) {
    super({
      codeDescription: Code.UNAUTHORIZED_ERROR,
      data: { userId },
    });
  }
}
