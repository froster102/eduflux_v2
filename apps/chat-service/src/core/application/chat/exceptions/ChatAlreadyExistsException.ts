import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class ChatAlreadyExistsException extends Exception<{
  userIds: string[];
}> {
  constructor(userIds: string[]) {
    super({
      codeDescription: Code.CONFLICT_ERROR,
      overrideMessage: 'A chat with the user already exists.',
      data: {
        userIds,
      },
    });
  }
}
