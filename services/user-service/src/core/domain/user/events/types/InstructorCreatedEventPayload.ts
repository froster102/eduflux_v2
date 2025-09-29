import type { CreateEventPayload } from '@core/common/events/types/CreateEventPayload';
import type { UserProfile } from '@core/domain/user/events/types/UserProfile';

export type InstructorCreatedEventPayload = {
  id: string;
  profile: UserProfile;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
} & CreateEventPayload;
