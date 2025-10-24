import type { CreateTaughtCoursePayload } from '@core/application/views/taught-course/entity/types/CreateTaughtViewPayload';
import { Entity } from '@core/common/entity/Entity';

export class TaughtCourseView extends Entity<string> {
  public readonly instructorId: string;
  public title: string;
  public thumbnail: string | null;
  public level: string | null;
  public enrollmentCount: number;
  public averageRating: number;
  public readonly createdAt: string;
  public updatedAt: string;

  private constructor(payload: CreateTaughtCoursePayload) {
    super();
    this.id = payload.id;
    this.instructorId = payload.instructorId;
    this.title = payload.title ?? null;
    this.thumbnail = payload.thumbnail ?? null;
    this.level = payload.level ?? null;
    this.enrollmentCount = payload.enrollmentCount ?? 0;
    this.averageRating = payload.averageRating ?? 0;
    this.createdAt = payload.createdAt ?? new Date().toISOString();
    this.updatedAt = payload.updatedAt ?? new Date().toISOString();
  }

  public static new(payload: CreateTaughtCoursePayload): TaughtCourseView {
    return new TaughtCourseView(payload);
  }

  public updateCourseInfo(update: Partial<CreateTaughtCoursePayload>) {
    this.title = update.title ?? this.title;
    this.thumbnail = update.thumbnail ?? this.thumbnail;
    this.level = update.level ?? this.level;
    this.enrollmentCount = update.enrollmentCount ?? this.enrollmentCount;
    this.averageRating = update.averageRating ?? this.averageRating;
    this.updatedAt = new Date().toISOString();
  }
}
