import { Event } from '@eduflux-v2/shared/events/Event';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import type { UserProfile } from '@domain/user/events/types/UserProfile';

export interface InstructorCreatedEventPayload {
  readonly profile: UserProfile;
  readonly sessionsConducted: number;
  readonly totalCourses: number;
  readonly totalLearners: number;
}

export class InstructorCreatedEvent extends Event<InstructorCreatedEventPayload> {
  static readonly EVENT_NAME: string = InstructorEvents.INSTRUCTOR_CREATED;

  constructor(id: string, payload: InstructorCreatedEventPayload) {
    super({ id, name: InstructorEvents.INSTRUCTOR_CREATED }, payload);
  }
}
