import { Event } from '@shared/events/Event';
import { InstructorEvents } from '@shared/events/user/enum/InstructorEvents';

export interface UserProfile {
  readonly name: string;
  readonly bio?: string;
  readonly image?: string;
}

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
