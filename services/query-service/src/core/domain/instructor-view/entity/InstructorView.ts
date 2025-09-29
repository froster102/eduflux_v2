import { Entity } from "@core/common/entity/Entity";
import type { CreateInstructorViewPayload } from "@core/domain/instructor-view/entity/types/CreateInstructorViewPayload";
import type { SessionPricingDetails } from "@core/domain/instructor-view/entity/types/SessionPricingDetails";
import type { UserProfile } from "@core/domain/instructor-view/entity/types/UserProfile";

export class InstructorView extends Entity<string> {
  public readonly profile: UserProfile;

  public readonly sessionsConducted: number;
  public readonly totalCourses: number;
  public readonly totalLearners: number;

  public readonly pricing: SessionPricingDetails;

  private constructor(payload: CreateInstructorViewPayload) {
    super(payload.id);

    this.profile = payload.profile;

    this.sessionsConducted = payload.sessionsConducted ?? 0;
    this.totalCourses = payload.totalCourses ?? 0;
    this.totalLearners = payload.totalLearners ?? 0;

    this.pricing = {
      price: payload.pricing?.price ?? 0,
      currency: payload.pricing?.currency ?? "USD",
      duration: payload.pricing?.duration ?? 0,
      timeZone: payload.pricing?.timeZone ?? "UTC",
      isSchedulingEnabled: payload.pricing?.isSchedulingEnabled ?? false,
    };
  }

  public static new(payload: CreateInstructorViewPayload): InstructorView {
    return new InstructorView(payload);
  }
}
