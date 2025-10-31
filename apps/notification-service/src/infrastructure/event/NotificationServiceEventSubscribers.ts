import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { EnrollmentCompletedEventSubscriber } from '@core/application/notification/subscriber/EnrollmentCompletedEventSubscriber';
import type { SessionConfirmedEventSubscriber } from '@core/application/notification/subscriber/SessionConfirmedEventSubscriber';
import type { Container } from 'inversify';

export class NotificationServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): NotificationServiceEventSubscribers {
    const enrollmentCompleted =
      container.get<EnrollmentCompletedEventSubscriber>(
        NotificationDITokens.EnrollmentCompletedEventSubscriber,
      );
    const sessionConfirmed = container.get<SessionConfirmedEventSubscriber>(
      NotificationDITokens.SessionConfirmedEventSubscriber,
    );
    return new NotificationServiceEventSubscribers([
      enrollmentCompleted,
      sessionConfirmed,
    ]);
  }
}
