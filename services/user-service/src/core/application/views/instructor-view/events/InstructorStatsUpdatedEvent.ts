import type { Event } from '@core/common/events/Event';
import type { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';

export interface InstructorStatsUpdatedEvent extends Event {
  id: string;
  type: InstructorEvents.INSTRUCTOR_STATS_UPDATED;
  instructorId: string;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
}
