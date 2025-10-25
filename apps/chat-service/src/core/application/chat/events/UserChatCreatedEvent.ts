import type { ChatEvents } from '@core/application/chat/events/enum/ChatEvents';
import type { Event } from '@core/common/events/Event';
import type { ChatParticipant } from '@core/domain/chat/entity/Chat';

export interface UserChatCreatedEvent extends Event {
  readonly type: ChatEvents.USER_CHAT_CREATED;
  readonly participants: ChatParticipant[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
