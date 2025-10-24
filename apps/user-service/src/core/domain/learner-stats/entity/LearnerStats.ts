import { Entity } from '@core/common/entity/Entity';
import type { CreateLearnerStatsPayload } from '@core/domain/learner-stats/entity/types/CreateLearnerStatsPayload';
import type { NewLearnerStatsPayload } from '@core/domain/learner-stats/entity/types/NewLearnerStatsPayload';

export class LearnerStats extends Entity<string> {
  private completedCourses: number;
  private completedSessions: number;
  private enrolledCourses: number;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(payload: NewLearnerStatsPayload) {
    super();
    this.id = payload.id;
    this.completedCourses = payload.completedCourses;
    this.completedSessions = payload.completedSessions;
    this.enrolledCourses = payload.enrolledCourses;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  public getCompletedCourses(): number {
    return this.completedCourses;
  }

  public getCompletedSessions(): number {
    return this.completedSessions;
  }

  public getEnrolledCourses(): number {
    return this.enrolledCourses;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public incrementCompletedSessions(): void {
    this.completedSessions++;
    this.updatedAt = new Date();
  }

  public incrementCompletedCourses(): void {
    this.completedCourses++;
    this.adjustEnrolledCourses(-1);
    this.updatedAt = new Date();
  }

  public adjustEnrolledCourses(count: number): void {
    this.enrolledCourses += count;
    if (this.enrolledCourses < 0) {
      this.enrolledCourses = 0;
    }
    this.updatedAt = new Date();
  }

  public static new(payload: CreateLearnerStatsPayload): LearnerStats {
    const now = new Date();
    return new LearnerStats({
      ...payload,
      completedCourses: 0,
      completedSessions: 0,
      enrolledCourses: 0,
      createdAt: now,
      updatedAt: now,
    });
  }
}
