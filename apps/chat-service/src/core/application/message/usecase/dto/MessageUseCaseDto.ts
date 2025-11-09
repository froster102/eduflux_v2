import type { Message } from '@core/domain/message/entity/Message';
import type { MessageStatus } from '@eduflux-v2/shared/constants/MessageStatus';

export class MessageUseCaseDto {
  readonly id: string;
  readonly chatId: string;
  readonly senderId: string;
  readonly content: string;
  readonly status: MessageStatus;
  readonly isRead: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(message: Message) {
    this.id = message.id;
    this.chatId = message.chatId;
    this.senderId = message.senderId;
    this.content = message.content;
    this.status = message.status;
    this.isRead = message.isRead;
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
  }

  static fromEntity(message: Message): MessageUseCaseDto {
    return new MessageUseCaseDto(message);
  }

  static fromEntities(messages: Message[]): MessageUseCaseDto[] {
    return messages.map((message) => this.fromEntity(message));
  }
}
