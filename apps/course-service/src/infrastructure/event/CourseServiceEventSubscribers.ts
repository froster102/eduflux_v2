import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentPaymentSuccessfullEventSubscriber } from '@core/application/enrollment/subscriber/EnrollmentPaymentSuccessfullEventSubscriber';
import type { Container } from 'inversify';

export class CourseServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): CourseServiceEventSubscribers {
    return new CourseServiceEventSubscribers([]);
  }
}
