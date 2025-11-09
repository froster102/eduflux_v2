import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CreateEnrollmentSubscriber } from '@core/application/enrollment/subscriber/CreateEnrollmentSubscriber';
import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import type { Container } from 'inversify';

export class CourseServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): CourseServiceEventSubscribers {
    const createEnrollmentSubsciber = container.get<CreateEnrollmentSubscriber>(
      EnrollmentDITokens.CreateEnrollmentSubsciber,
    );
    return new CourseServiceEventSubscribers([createEnrollmentSubsciber]);
  }
}
