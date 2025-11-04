import { ChatEvents } from '@core/application/views/user-chat/events/enum/ChatEvents';
import { Event } from '@eduflux-v2/shared/events/Event';
import type { ChatParticipant } from '@core/domain/chat/entity/Chat';

export interface UserChatCreatedEventPayload extends Event {
  readonly participants: ChatParticipant[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class UserChatCreatedEvent extends Event<UserChatCreatedEventPayload> {
  static readonly EVENT_NAME = ChatEvents.USER_CHAT_CREATED;

  constructor(payload: UserChatCreatedEventPayload) {
    super(
      {
        id: payload.id,
        name: ChatEvents.USER_CHAT_CREATED,
      },
      payload,
    );
  }
}
