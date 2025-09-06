import type { MessageStatus } from "@core/common/enum/MessageStatus";

export interface UpdateMessageStatusPort {
  chatId: string;
  messageId: string;
  executorId: string;
  status: MessageStatus;
}
