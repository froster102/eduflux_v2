import type { CourseCreatedEvent } from '@core/application/views/coordinator/events/CourseCreatedEvent';
import type { CourseUpdatedEvent } from '@core/application/views/coordinator/events/CourseUpdatedEvent';
import type { InstructorCreatedEvent } from '@core/application/views/instructor-view/events/InstructorCreatedEvent';
import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { SessionSettingsUpdateEvent } from '@core/application/views/instructor-view/events/SessionSettingsEvent';
import type { EnrollmentCompletedEvent } from '@core/domain/learner-stats/events/EnrollmentCompletedEvent';
import type { SessionCompletedEvent } from '@core/domain/learner-stats/events/SessionCompletedEvent';
import type { UserUpdatedEvent } from '@core/domain/user/events/UserUpdatedEvent';

export type KafkaEvent =
  | InstructorCreatedEvent
  | SessionSettingsUpdateEvent
  | InstructorStatsUpdatedEvent
  | SessionCompletedEvent
  | UserUpdatedEvent
  | CourseCreatedEvent
  | CourseUpdatedEvent
  | EnrollmentCompletedEvent;
