import { Entity } from "@core/common/entity/Entity";
import type { Role } from "@core/common/enum/Role";
import type { CreateChatPayload } from "@core/domain/chat/entity/type/CreateChatPayload";

export interface ChatParticipant {
  userId: string;
  role: Role;
}

export class Chat extends Entity<string> {
  private readonly _participants: ChatParticipant[];
  private _lastMessageAt: Date;
  private _lastMessagePreview: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(payload: CreateChatPayload) {
    super(payload.id);
    this._participants = payload.participants;
    this._lastMessagePreview = "";
    this._lastMessageAt = payload.lastMessageAt;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  get participants(): ChatParticipant[] {
    return this._participants;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get lastMessagePreview(): string {
    return this._lastMessagePreview;
  }
  get lastMessageAt(): Date {
    return this._lastMessageAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  isParticipant(userId: string): boolean {
    return this._participants.some(
      (participant) => participant.userId === userId,
    );
  }

  updateLastMessagedAt(date: Date): void {
    this._lastMessageAt = date;
    this._updatedAt = new Date();
    return;
  }

  static new(payload: CreateChatPayload) {
    return new Chat(payload);
  }
}
