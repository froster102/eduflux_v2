import type { UserChatEvents } from "@core/domain/user-chat/events/enum/UserChatEvents";
import type { Role } from "@shared/constants/roles";

export type UserChatCreatedEvent = {
  type: UserChatEvents.USER_CHAT_CREATED;
  data: {
    readonly id: string;
    readonly participants: { userId: string; role: Role }[];
    readonly lastMessageAt: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  };
};
