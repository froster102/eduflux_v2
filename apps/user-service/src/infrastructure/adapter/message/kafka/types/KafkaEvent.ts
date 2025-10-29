import type { CourseCreatedEvent } from '@application/views/coordinator/events/CourseCreatedEvent';
import type { CoursePublishedEvent } from '@application/views/coordinator/events/CoursePublishedEvent';
import type { CourseUpdatedEvent } from '@application/views/coordinator/events/CourseUpdatedEvent';
import type { InstructorCreatedEvent } from '@application/views/instructor-view/events/InstructorCreatedEvent';
import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { SessionSettingsUpdateEvent } from '@application/views/instructor-view/events/SessionSettingsEvent';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';
import type { UserUpdatedEvent } from '@eduflux-v2/shared/events/user/UserUpdatedEvents';

export type KafkaEvent =
  | InstructorCreatedEvent
  | SessionSettingsUpdateEvent
  | InstructorStatsUpdatedEvent
  | SessionCompletedEvent
  | UserUpdatedEvent
  | CourseCreatedEvent
  | CourseUpdatedEvent
  | EnrollmentCompletedEvent
  | CoursePublishedEvent;
