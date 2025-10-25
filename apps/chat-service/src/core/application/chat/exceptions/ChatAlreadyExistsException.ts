import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

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
