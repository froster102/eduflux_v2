import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class UserNotFoundException extends Exception<{ userId: string }> {
  constructor(userId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'User not found',
      data: { userId },
    });
  }
}
