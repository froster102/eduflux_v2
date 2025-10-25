import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class ChatNotFoundException extends Exception<{ chatId: string }> {
  constructor(chatId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Chat not found.',
      data: {
        chatId,
      },
    });
  }
}
