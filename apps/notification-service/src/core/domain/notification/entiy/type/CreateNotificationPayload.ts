import type { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';

export type CreateNotificationPayload = {
  id: string;
  userId: string;
  status: NotificationStatus;
  title: string;
  description: string;
  path: string;
  timestamp: string;
};

export type NewNotificationPayload = {
  createdAt: Date;
  updatedAt: Date;
} & CreateNotificationPayload;
