import { LearnerStats } from '@core/domain/learner-stats/entity/LearnerStats';
import type { MongooseLearnerStats } from '@infrastructure/adapter/persistence/mongoose/models/learner-stats/MongooseLearnerStats';

export class LearnerStatsMapper {
  static toDomain(mongooseLearnerStats: MongooseLearnerStats): LearnerStats {
    const domainLearnerStats: LearnerStats = new LearnerStats({
      id: mongooseLearnerStats._id,
      completedCourses: mongooseLearnerStats.completedCourses,
      completedSessions: mongooseLearnerStats.completedSessions,
      enrolledCourses: mongooseLearnerStats.enrolledCourses,
      createdAt: mongooseLearnerStats.createdAt,
      updatedAt: mongooseLearnerStats.updatedAt,
    });
    return domainLearnerStats;
  }

  static toPersistence(
    domainLearnerStats: LearnerStats,
  ): Partial<MongooseLearnerStats> {
    const mongooseLearnerStats: Partial<MongooseLearnerStats> = {
      _id: domainLearnerStats.getId(),
      completedCourses: domainLearnerStats.getCompletedCourses(),
      completedSessions: domainLearnerStats.getCompletedSessions(),
      enrolledCourses: domainLearnerStats.getEnrolledCourses(),
      createdAt: domainLearnerStats.getCreatedAt(),
      updatedAt: domainLearnerStats.getUpdatedAt(),
    };
    return mongooseLearnerStats;
  }

  static toDomainEntities(raw: MongooseLearnerStats[]): LearnerStats[] {
    return raw.map((r) => this.toDomain(r));
  }
}
