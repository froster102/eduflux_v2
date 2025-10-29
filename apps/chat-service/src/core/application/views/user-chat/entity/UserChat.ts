import type { ChatParticipant } from '@core/application/views/user-chat/entity/types/ChatParticipant';
import type { CreateUserChatPayload } from '@core/application/views/user-chat/entity/types/CreateUserChatPayload';
import { Entity } from '@eduflux-v2/shared/entities/Entity';

export class UserChat extends Entity<string> {
  public readonly lastMessageAt: string;
  public readonly lastMessagePreview: string | null;
  public readonly createdAt: string;

  public readonly participants: ChatParticipant[];

  private constructor(payload: CreateUserChatPayload) {
    super(payload.id);
    this.lastMessageAt = payload.lastMessageAt;
    this.lastMessagePreview = payload.lastMessagePreview;
    this.createdAt = payload.createdAt;
    this.participants = payload.participants;
  }

  static new(payload: CreateUserChatPayload): UserChat {
    return new UserChat(payload);
  }

  toJSON() {
    return {
      id: this._id,
      lastMessageAt: this.lastMessageAt,
      lastMessagePreview: this.lastMessagePreview,
      createdAt: this.createdAt,
      participants: this.participants.map((p) => ({ ...p })),
    };
  }
}
