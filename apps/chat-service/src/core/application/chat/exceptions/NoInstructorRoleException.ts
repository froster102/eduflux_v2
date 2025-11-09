import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class NoInstructorRoleException extends Exception<void> {
  constructor() {
    super({
      codeDescription: Code.FORBIDDEN_ERROR,
      overrideMessage: 'A chat can only be created with a instructor.',
    });
  }
}
