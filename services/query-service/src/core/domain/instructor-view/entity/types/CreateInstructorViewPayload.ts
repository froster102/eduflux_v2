import type { SessionPricingDetails } from "@core/domain/instructor-view/entity/types/SessionPricingDetails";
import type { UserProfile } from "@core/domain/instructor-view/entity/types/UserProfile";

export type CreateInstructorViewPayload = {
  id: string;

  profile: UserProfile;

  sessionsConducted?: number;
  totalCourses?: number;
  totalLearners?: number;

  pricing?: Partial<SessionPricingDetails>;
};
