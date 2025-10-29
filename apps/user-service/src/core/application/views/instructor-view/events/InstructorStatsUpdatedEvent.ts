import type { Event } from '@eduflux-v2/shared/events/Event';
import type { InstructorEvents } from '@domain/instructor/events/InstructorEvents';

export interface InstructorStatsUpdatedEvent extends Event {
  id: string;
  type: InstructorEvents.INSTRUCTOR_STATS_UPDATED;
  instructorId: string;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
}
