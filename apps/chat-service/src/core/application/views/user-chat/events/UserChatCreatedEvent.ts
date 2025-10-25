import type { ChatEvents } from '@core/application/chat/events/enum/ChatEvents';
import type { Role } from '@core/common/enum/Role';
import type { Event } from '@core/common/events/Event';

export interface UserChatCreatedEvent extends Event {
  readonly type: ChatEvents.USER_CHAT_CREATED;
  readonly participants: { userId: string; role: Role }[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
