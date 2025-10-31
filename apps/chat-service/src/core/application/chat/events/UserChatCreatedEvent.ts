import { ChatEvents } from '@core/application/chat/events/enum/ChatEvents';
import { Event } from '@eduflux-v2/shared/events/Event';
import type { ChatParticipant } from '@core/domain/chat/entity/Chat';

export interface UserChatCreatedEventPayload extends Event {
  readonly participants: ChatParticipant[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class UserChatCreatedEvent extends Event {
  static readonly EVENT_NAME = ChatEvents.USER_CHAT_CREATED;

  readonly participants: ChatParticipant[];
  readonly lastMessageAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(payload: UserChatCreatedEventPayload) {
    super({
      id: payload.id,
      name: ChatEvents.USER_CHAT_CREATED,
    });

    this.participants = payload.participants;
    this.lastMessageAt = payload.lastMessageAt;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }
}
