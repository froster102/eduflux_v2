import type { LearnerStats } from '@core/domain/learner-stats/entity/LearnerStats';

export class LearnerUseCaseDto {
  public readonly id: string;
  public readonly completedCourses: number;
  public readonly completedSessions: number;
  public readonly enrolledCourses: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(stats: LearnerStats) {
    this.id = stats.getId();
    this.completedCourses = stats.getCompletedCourses();
    this.completedSessions = stats.getCompletedSessions();
    this.enrolledCourses = stats.getEnrolledCourses();
    this.createdAt = stats.getCreatedAt();
    this.updatedAt = stats.getUpdatedAt();
  }

  public static fromEntity(stats: LearnerStats): LearnerUseCaseDto {
    return new LearnerUseCaseDto(stats);
  }

  public static fromEntities(stats: LearnerStats[]): LearnerUseCaseDto[] {
    return stats.map((s) => new LearnerUseCaseDto(s));
  }
}
