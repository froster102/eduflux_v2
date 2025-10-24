import { Code } from '@shared/common/error/Code';
import { Exception } from '@shared/common/exception/Exception';

export class ForbiddenException extends Exception<void> {
  constructor(message: string) {
    super({
      codeDescription: {
        code: Code.FORBIDDEN_ERROR.code,
        message: Code.FORBIDDEN_ERROR.message,
      },
      overrideMessage: message,
    });
  }
}
