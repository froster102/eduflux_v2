import type { Role } from "@core/common/enums/Role";
import type { Event } from "@core/common/events/Event";
import type { UserChatEvents } from "@core/domain/user-chat/events/enum/UserChatEvents";

export interface UserChatCreatedEvent extends Event {
  readonly type: UserChatEvents.USER_CHAT_CREATED;
  readonly participants: { userId: string; role: Role }[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
