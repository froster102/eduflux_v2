import { Event } from '@core/common/events/Event';
import type { InstructorCreatedEventPayload } from '@core/domain/user/events/types/InstructorCreatedEventPayload';
import type { UserProfile } from '@core/domain/user/events/types/UserProfile';

export class InstructorCreatedEvent extends Event {
  public readonly id: string;
  public readonly profile: UserProfile;
  public readonly sessionsConducted: number;
  public readonly totalCourses: number;
  public readonly totalLearners: number;

  private constructor(payload: InstructorCreatedEventPayload) {
    super({ type: payload.type, occuredAt: payload.occuredAt });
    this.id = payload.id;
    this.profile = payload.profile;
    this.sessionsConducted = payload.sessionsConducted;
    this.totalCourses = payload.totalCourses;
    this.totalLearners = payload.totalLearners;
  }

  public static new(
    payload: InstructorCreatedEventPayload,
  ): InstructorCreatedEvent {
    return new InstructorCreatedEvent(payload);
  }
}
