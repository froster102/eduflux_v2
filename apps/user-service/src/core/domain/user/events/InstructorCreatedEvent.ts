import type { Event } from '@eduflux-v2/shared/events/Event';
import type { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import type { UserProfile } from '@domain/user/events/types/UserProfile';

export interface InstructorCreatedEvent extends Event {
  readonly type: InstructorEvents.INSTRUCTOR_CREATED;
  readonly id: string;
  readonly profile: UserProfile;
  readonly sessionsConducted: number;
  readonly totalCourses: number;
  readonly totalLearners: number;
}
