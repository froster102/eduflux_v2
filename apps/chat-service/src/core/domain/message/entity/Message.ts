import { Entity } from '@core/common/entity/Entity';
import { MessageStatus } from '@core/common/enum/MessageStatus';
import type { CreateMessagePayload } from '@core/domain/message/entity/type/CreateMessagePayload';

export class Message extends Entity<string> {
  private readonly _chatId: string;
  private readonly _senderId: string;
  private _content: string;
  private _status: MessageStatus;
  private _isRead: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(payload: CreateMessagePayload) {
    super(payload.id);
    this._chatId = payload.chatId;
    this._senderId = payload.senderId;
    this._content = payload.content;
    this._status = payload.status;
    this._isRead = payload.isRead;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  get chatId(): string {
    return this._chatId;
  }
  get senderId(): string {
    return this._senderId;
  }
  get content(): string {
    return this._content;
  }
  get status(): MessageStatus {
    return this._status;
  }
  get isRead(): boolean {
    return this._isRead;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateStatus(status: MessageStatus): void {
    this._status = status;
  }

  markAsRead(): void {
    this._status = MessageStatus.READ;
    this._isRead = true;
    this._updatedAt = new Date();
  }

  markAsDelivered(): void {
    this._status = MessageStatus.DELIVERED;
    this._updatedAt = new Date();
  }

  markAsSend(): void {
    this._status = MessageStatus.SENT;
    this._updatedAt = new Date();
  }

  static new(payload: CreateMessagePayload): Message {
    return new Message(payload);
  }
}
