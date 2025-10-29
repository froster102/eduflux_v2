import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Notification } from '@core/domain/notification/entiy/Notification';

export interface NotificationRepositoryPort
  extends BaseRepositoryPort<Notification> {
  findByUserId(userId: string): Promise<Notification[]>;
}
