import type { ChatParticipant } from "@core/application/user-chat/entity/types/ChatParticipant";

export type CreateUserChatPayload = {
  id: string;
  lastMessageAt: string;
  lastMessagePreview: string | null;
  createdAt: string;
  participants: ChatParticipant[];
};
