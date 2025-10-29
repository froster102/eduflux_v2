import type { MessageStatus } from '@eduflux-v2/shared/constants/MessageStatus';

export type CreateMessagePayload = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  status: MessageStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};
