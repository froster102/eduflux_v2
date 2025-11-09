import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class MessageNotFoundException extends Exception<{
  chatId: string;
  messageId: string;
}> {
  constructor(chatId: string, messageId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Message not found.',
      data: { messageId, chatId },
    });
  }
}
