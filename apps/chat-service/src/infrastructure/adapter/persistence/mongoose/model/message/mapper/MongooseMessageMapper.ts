import { Message } from "@core/domain/message/entity/Message";
import type { MongooseMessage } from "@infrastructure/adapter/persistence/mongoose/model/message/MongooseMessage";

export class MongooseMessageMapper {
  static toDomain(raw: MongooseMessage): Message {
    return new Message({
      id: raw._id,
      chatId: raw.chatId,
      content: raw.content,
      senderId: raw.senderId,
      isRead: raw.isRead,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(raw: Message): Partial<MongooseMessage> {
    return {
      _id: raw.id,
      chatId: raw.chatId,
      content: raw.content,
      senderId: raw.senderId,
      isRead: raw.isRead,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainEntities(raw: MongooseMessage[]): Message[] {
    return raw.map((r) => this.toDomain(r));
  }
}
