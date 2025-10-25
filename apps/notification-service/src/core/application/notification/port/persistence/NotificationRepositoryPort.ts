import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Notification } from '@core/domain/notification/entiy/Notification';

export interface NotificationRepositoryPort
  extends BaseRepositoryPort<Notification> {
  findByUserId(userId: string): Promise<Notification[]>;
}
