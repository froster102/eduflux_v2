import { Notification } from '@core/domain/notification/entiy/Notification';
import type { MongooseNotification } from '@infrastructure/adapter/persistence/mongoose/model/notification/MongooseNotification';

export class MongooseNotificationMapper {
  static toDomain(document: MongooseNotification): Notification {
    return Notification.new({
      id: document._id,
      userId: document.userId,
      title: document.title,
      description: document.description,
      status: document.status,
      path: document.path,
      timestamp: document.timestamp,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static toPersistence(entity: Notification): Partial<MongooseNotification> {
    return {
      _id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      path: entity.path,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomainEntities(documents: MongooseNotification[]): Notification[] {
    return documents.map((document) => this.toDomain(document));
  }
}
