import { Chat, type ChatParticipant } from "@core/domain/chat/entity/Chat";

export class ChatUseCaseDto {
  readonly id: string;
  readonly participants: ChatParticipant[];
  readonly lastMessageAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(chat: Chat) {
    this.id = chat.id;
    this.participants = chat.participants;
    this.lastMessageAt = chat.lastMessageAt;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
  }

  static fromEntity(chat: Chat): ChatUseCaseDto {
    return new ChatUseCaseDto(chat);
  }

  static fromEntities(chats: Chat[]): ChatUseCaseDto[] {
    return chats.map((chat) => this.fromEntity(chat));
  }
}
