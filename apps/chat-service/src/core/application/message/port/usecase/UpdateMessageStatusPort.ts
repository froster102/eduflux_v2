import type { MessageStatus } from '@eduflux-v2/shared/constants/MessageStatus';

export interface UpdateMessageStatusPort {
  chatId: string;
  messageId: string;
  executorId: string;
  status: MessageStatus;
}
