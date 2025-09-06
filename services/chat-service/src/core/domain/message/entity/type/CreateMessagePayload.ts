import { MessageStatus } from "@core/common/enum/MessageStatus";

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
