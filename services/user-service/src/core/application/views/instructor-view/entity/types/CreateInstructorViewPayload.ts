import type { SessionPricingDetails } from '@core/application/views/instructor-view/entity/types/SessionPricingDetails';
import type { UserProfile } from '@core/domain/user/events/types/UserProfile';

export type CreateInstructorViewPayload = {
  id: string;

  profile: UserProfile;

  sessionsConducted?: number;
  totalCourses?: number;
  totalLearners?: number;

  pricing?: Partial<SessionPricingDetails>;
};
