import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

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
