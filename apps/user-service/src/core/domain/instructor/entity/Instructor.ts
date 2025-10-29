import { Entity } from '@eduflux-v2/shared/entities/Entity';
import type { CreateInstructorPayload } from '@domain/instructor/entity/types/CreateInstructorPayload';
import type { NewInstructorPayload } from '@domain/instructor/entity/types/NewInstructorPayload';

export class Instructor extends Entity<string> {
  private sessionsConducted: number;
  private totalCourses: number;
  private totalLearners: number;
  private isSessionEnabled: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(payload: NewInstructorPayload) {
    super(payload.id);
    this.sessionsConducted = payload.sessionsConducted;
    this.isSessionEnabled = payload.isSessionEnabled;
    this.totalCourses = payload.totalCourses;
    this.totalLearners = payload.totalLearners;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  public getSessionsConducted(): number {
    return this.sessionsConducted;
  }

  public getTotalCourses(): number {
    return this.totalCourses;
  }

  public getTotalLearners(): number {
    return this.totalLearners;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getIsSessionEnabled(): boolean {
    return this.isSessionEnabled;
  }

  public incrementSessionsConducted(): void {
    this.sessionsConducted++;
    this.updatedAt = new Date();
  }

  public incrementCoursesCreated(): void {
    this.totalCourses++;
    this.updatedAt = new Date();
  }

  public addLearners(count: number): void {
    this.totalLearners += count;
    this.updatedAt = new Date();
  }

  public static new(payload: CreateInstructorPayload): Instructor {
    return new Instructor({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
