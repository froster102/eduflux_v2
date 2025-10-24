import { Code } from "@core/common/error/Code";
import { Exception } from "@core/common/exception/Exception";

export class MessageNotFoundException extends Exception<{
  chatId: string;
  messageId: string;
}> {
  constructor(chatId: string, messageId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: "Message not found.",
      data: { messageId, chatId },
    });
  }
}
