import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class NoInstructorRoleException extends Exception<void> {
  constructor() {
    super({
      codeDescription: Code.FORBIDDEN_ERROR,
      overrideMessage: 'A chat can only be created with a instructor.',
    });
  }
}
