import type { InstructorViewEvents } from "@core/domain/instructor-view/enum/InstructorViewEvents";
import type { UserProfile } from "@core/domain/instructor-view/entity/types/UserProfile";

export type InstructorCreatedEvent = {
  type: InstructorViewEvents.INSTRUCTOR_CREATED;
  id: string;
  profile: UserProfile;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
};
