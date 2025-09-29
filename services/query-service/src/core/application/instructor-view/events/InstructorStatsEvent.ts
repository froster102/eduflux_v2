import type { InstructorViewEvents } from "@core/domain/instructor-view/enum/InstructorViewEvents";

export type InstructorStatsEvent = {
  type: InstructorViewEvents.INSTRUCTOR_STATS_UPDATED;
  instructorId: string;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
};
