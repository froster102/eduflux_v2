import type { Event } from '@core/common/events/Event';
import type { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';
import type { UserProfile } from '@core/domain/user/events/types/UserProfile';

export interface InstructorCreatedEvent extends Event {
  readonly type: InstructorEvents.INSTRUCTOR_CREATED;
  readonly id: string;
  readonly profile: UserProfile;
  readonly sessionsConducted: number;
  readonly totalCourses: number;
  readonly totalLearners: number;
}
