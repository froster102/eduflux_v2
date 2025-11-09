import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { UserCreatedEventSubscriber } from '@analytics/subscriber/UserCreatedEventSubscriber';
import type { InstructorCreatedEventSubscriber } from '@analytics/subscriber/InstructorCreatedEventSubscriber';
import type { CoursePublishedEventSubscriber } from '@analytics/subscriber/CoursePublishedEventSubscriber';
import type { PaymentSuccessfullEventSubscriber } from '@analytics/subscriber/PaymentSuccessfullEventSubscriber';
import type { Container } from 'inversify';

export class AnalyticsServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): AnalyticsServiceEventSubscribers {
    const userCreated = container.get<UserCreatedEventSubscriber>(
      AnalyticsDITokens.UserCreatedEventSubscriber,
    );
    const instructorCreated = container.get<InstructorCreatedEventSubscriber>(
      AnalyticsDITokens.InstructorCreatedEventSubscriber,
    );
    const coursePublished = container.get<CoursePublishedEventSubscriber>(
      AnalyticsDITokens.CoursePublishedEventSubscriber,
    );
    const paymentSuccessfull = container.get<PaymentSuccessfullEventSubscriber>(
      AnalyticsDITokens.PaymentSuccessfullEventSubscriber,
    );

    return new AnalyticsServiceEventSubscribers([
      userCreated,
      instructorCreated,
      coursePublished,
      paymentSuccessfull,
    ]);
  }
}
