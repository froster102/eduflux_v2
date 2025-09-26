import type { ChatParticipant } from "@core/application/user-chat/entity/types/ChatParticipant";
import { UserChat } from "@core/application/user-chat/entity/UserChat";
import type { MongooseUserChat } from "@infrastructure/adapter/persistence/mongoose/model/user-chat/MongooseUserChat";

export class MongooseUserChatMapper {
  static toDomain(document: MongooseUserChat): UserChat {
    const participants: ChatParticipant[] = document.participants.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      image: p.image,
    }));

    return UserChat.new({
      id: document._id,
      lastMessageAt: document.lastMessageAt,
      lastMessagePreview: document.lastMessagePreview,
      createdAt: document.createdAt,
      participants,
    });
  }

  static toPersistence(entity: UserChat): Partial<MongooseUserChat> {
    return {
      _id: entity.getId(),
      lastMessageAt: entity.lastMessageAt,
      lastMessagePreview: entity.lastMessagePreview,
      createdAt: entity.createdAt,
      participants: entity.participants.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        image: p.image,
      })),
    };
  }

  static toDomainEntities(documents: MongooseUserChat[]): UserChat[] {
    return documents.map((document) => this.toDomain(document));
  }
}
