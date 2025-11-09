import type { Notification } from '@core/domain/notification/entiy/Notification';
import type { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';

export class NotificationUseCaseDto {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly status: NotificationStatus;
  readonly timestamp: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(notification: Notification) {
    this.id = notification.id;
    this.userId = notification.userId;
    this.title = notification.title;
    this.description = notification.description;
    this.path = notification.path;
    this.status = notification.status;
    this.timestamp = notification.timestamp;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }

  static fromEntity(notification: Notification): NotificationUseCaseDto {
    return new NotificationUseCaseDto(notification);
  }

  static fromEntities(notifications: Notification[]): NotificationUseCaseDto[] {
    return notifications.map((notification) => this.fromEntity(notification));
  }
}
