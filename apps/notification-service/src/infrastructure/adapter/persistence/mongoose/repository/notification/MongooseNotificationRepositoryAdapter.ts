import type { NotificationRepositoryPort } from '@core/application/notification/port/persistence/NotificationRepositoryPort';
import { Notification } from '@core/domain/notification/entiy/Notification';
import { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';
import { MongooseNotificationMapper } from '@infrastructure/adapter/persistence/mongoose/model/notification/mapper/MongooseNotificationMapper';
import {
  NotificationModel,
  type MongooseNotification,
} from '@infrastructure/adapter/persistence/mongoose/model/notification/MongooseNotification';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { DatabaseException } from '@eduflux-v2/shared/exceptions/DatabaseException';

export class MongooseNotificatoinRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Notification, MongooseNotification>
  implements NotificationRepositoryPort
{
  constructor() {
    super(NotificationModel, MongooseNotificationMapper);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await NotificationModel.find({
      userId,
      status: NotificationStatus.UNSEEN,
    })
      .sort({ createdAt: -1 })
      .catch((error: Error) => {
        throw new DatabaseException(error?.message);
      });
    return MongooseNotificationMapper.toDomainEntities(notifications);
  }
}
