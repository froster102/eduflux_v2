import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class UserNotFoundException extends Exception<{ userId: string }> {
  constructor(userId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'User not found',
      data: { userId },
    });
  }
}
