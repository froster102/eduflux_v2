import { Event } from '@eduflux-v2/shared/events/Event';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';

export interface InstructorStatsUpdatedEventPayload {
  readonly instructorId: string;
  readonly sessionsConducted: number;
  readonly totalCourses: number;
  readonly totalLearners: number;
}

export class InstructorStatsUpdatedEvent extends Event<InstructorStatsUpdatedEventPayload> {
  static readonly EVENT_NAME: string =
    InstructorEvents.INSTRUCTOR_STATS_UPDATED;

  constructor(id: string, payload: InstructorStatsUpdatedEventPayload) {
    super({ id, name: InstructorEvents.INSTRUCTOR_STATS_UPDATED }, payload);
  }
}
