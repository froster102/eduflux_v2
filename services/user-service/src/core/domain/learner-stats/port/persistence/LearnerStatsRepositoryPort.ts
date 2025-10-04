import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';
import type { LearnerStats } from '@core/domain/learner-stats/entity/LearnerStats';

export interface LearnerStatsRepositoryPort
  extends BaseRepositoryPort<LearnerStats> {
  incrementCompletedSessions(learnerId: string): Promise<void>;
  incrementCompletedCourses(learnerId: string): Promise<void>;
  adjustEnrolledCourses(learnerId: string, count: number): Promise<void>;
  completeCourse(learnerId: string): Promise<void>;
}
