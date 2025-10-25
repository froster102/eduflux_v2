import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class ChatAccessForbiddenException extends Exception<{
  userId: string;
  chatId: string;
}> {
  constructor(chatId: string, userId: string) {
    super({
      codeDescription: Code.FORBIDDEN_ERROR,
      overrideMessage: 'User does not have chat access to this chat.',
      data: { userId, chatId },
    });
  }
}
