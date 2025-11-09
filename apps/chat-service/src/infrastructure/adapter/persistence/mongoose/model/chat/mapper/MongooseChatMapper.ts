import { Chat } from '@core/domain/chat/entity/Chat';
import type { MongooseChat } from '@infrastructure/adapter/persistence/mongoose/model/chat/MongooseChat';

export class MongooseChatMapper {
  static toDomain(raw: MongooseChat): Chat {
    return new Chat({
      id: raw._id,
      participants: raw.participants,
      lastMessageAt: raw.lastMessageAt,
      lastMessagePreview: raw.lastMessagePreview,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(raw: Chat): Partial<MongooseChat> {
    return {
      _id: raw.id,
      participants: raw.participants,
      lastMessageAt: raw.lastMessageAt,
      lastMessagePreview: raw.lastMessagePreview,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainEntities(raw: MongooseChat[]): Chat[] {
    return raw.map((r) => this.toDomain(r));
  }
}
