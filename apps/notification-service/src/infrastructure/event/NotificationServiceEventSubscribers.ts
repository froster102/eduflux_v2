import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { EnrollmentCreatedEventSubscriber } from '@core/application/notification/subscriber/EnrollmentCreatedEventSubscriber';
import type { SessionConfirmedEventSubscriber } from '@core/application/notification/subscriber/SessionConfirmedEventSubscriber';
import type { Container } from 'inversify';

export class NotificationServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): NotificationServiceEventSubscribers {
    const enrollmentCreated = container.get<EnrollmentCreatedEventSubscriber>(
      NotificationDITokens.EnrollmentCreatedEventSubscriber,
    );
    const sessionConfirmed = container.get<SessionConfirmedEventSubscriber>(
      NotificationDITokens.SessionConfirmedEventSubscriber,
    );
    return new NotificationServiceEventSubscribers([
      enrollmentCreated,
      sessionConfirmed,
    ]);
  }
}
