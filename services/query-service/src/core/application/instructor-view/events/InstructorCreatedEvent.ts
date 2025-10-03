import type { InstructorViewEvents } from "@core/domain/instructor-view/enum/InstructorViewEvents";
import type { UserProfile } from "@core/domain/instructor-view/entity/types/UserProfile";
import type { Event } from "@core/common/events/Event";

export interface InstructorCreatedEvent extends Event {
  readonly type: InstructorViewEvents.INSTRUCTOR_CREATED;
  readonly id: string;
  readonly profile: UserProfile;
  readonly sessionsConducted: number;
  readonly totalCourses: number;
  readonly totalLearners: number;
}
