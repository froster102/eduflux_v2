import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { EnrollmentCreatedEventSubscriber } from '@core/application/learner-stats/subscriber/EnrollmentCreatedEventSubscriber';
import type { SessionCompletedEventSubscriber } from '@application/learner-stats/subscriber/SessionCompletedEventSubscriber';
import type { InstructorCreatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorCreatedEventSubscriber';
import type { SessionSettingsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/SessionSettingsUpdatedEventSubscriber';
import type { InstructorStatsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorStatsUpdatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/UserUpdatedEventSubscriber';
import type { CourseCreatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseCreatedEventSubscriber';
import type { CourseUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseUpdatedEventSubscriber';
import type { CoursePublishedEventSubscriber } from '@application/views/coordinator/subscriber/CoursePublishedEventSubscriber';
import type { Container } from 'inversify';

export class UserServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): UserServiceEventSubscribers {
    const enrollmentCreated = container.get<EnrollmentCreatedEventSubscriber>(
      LearnerStatsDITokens.EnrollmentCreatedEventSubscriber,
    );
    const sessionCompleted = container.get<SessionCompletedEventSubscriber>(
      LearnerStatsDITokens.SessionCompletedEventSubscriber,
    );
    const instructorCreated = container.get<InstructorCreatedEventSubscriber>(
      InstructorViewDITokens.InstructorCreatedEventSubscriber,
    );
    const sessionSettingsUpdated =
      container.get<SessionSettingsUpdatedEventSubscriber>(
        InstructorViewDITokens.SessionSettingsUpdatedEventSubscriber,
      );
    const instructorStatsUpdated =
      container.get<InstructorStatsUpdatedEventSubscriber>(
        InstructorViewDITokens.InstructorStatsUpdatedEventSubscriber,
      );
    const userUpdated = container.get<UserUpdatedEventSubscriber>(
      InstructorViewDITokens.UserUpdatedEventSubscriber,
    );
    const courseCreated = container.get<CourseCreatedEventSubscriber>(
      TaughtCourseViewDITokens.CourseCreatedEventSubscriber,
    );
    const courseUpdated = container.get<CourseUpdatedEventSubscriber>(
      TaughtCourseViewDITokens.CourseUpdatedEventSubscriber,
    );
    const coursePublished = container.get<CoursePublishedEventSubscriber>(
      TaughtCourseViewDITokens.CoursePublishedEventSubscriber,
    );

    return new UserServiceEventSubscribers([
      enrollmentCreated,
      sessionCompleted,
      instructorCreated,
      sessionSettingsUpdated,
      instructorStatsUpdated,
      userUpdated,
      courseCreated,
      courseUpdated,
      coursePublished,
    ]);
  }
}
