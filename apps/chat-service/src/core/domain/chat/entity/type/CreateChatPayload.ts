import type { ChatParticipant } from "@core/domain/chat/entity/Chat";

export type CreateChatPayload = {
  id: string;
  participants: ChatParticipant[];
  lastMessagePreview: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
