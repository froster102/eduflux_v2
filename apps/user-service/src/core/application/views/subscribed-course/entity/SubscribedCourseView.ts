import type { CreateSubscribedCoursePayload } from '@core/application/views/subscribed-course/entity/types/CreateSubscribedCoursePayload';
import { Entity } from '@core/common/entity/Entity';

export class SubscribedCourseView extends Entity<string> {
  public readonly userId: string;
  public title: string;
  public thumbnail: string;
  public description: string;
  public enrollmentCount: number;
  public readonly instructor: {
    readonly id: string;
    readonly name: string;
  };
  public level: string;
  public averageRating: number;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  private constructor(payload: CreateSubscribedCoursePayload) {
    super();
    this.id = payload.id;
    this.userId = payload.userId;
    this.title = payload.title;
    this.description = payload.description;
    this.level = payload.level;
    this.thumbnail = payload.thumbnail;
    this.averageRating = payload.averageRating;
    this.enrollmentCount = payload.enrollmentCount;
    this.instructor = payload.instructor;
    this.createdAt = payload.createdAt ?? new Date().toISOString();
    this.updatedAt = payload.updatedAt ?? new Date().toISOString();
  }

  public static new(
    payload: CreateSubscribedCoursePayload,
  ): SubscribedCourseView {
    return new SubscribedCourseView(payload);
  }

  public updateCourseInfo(
    update: Partial<
      Omit<CreateSubscribedCoursePayload, 'id' | 'userId' | 'courseId'>
    >,
  ) {
    if (update.title) {
      this.title = update.title;
    }
    if (update.thumbnail) {
      this.thumbnail = update.thumbnail;
    }
  }
}
