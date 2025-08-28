import { Entity } from '@core/common/entity/Entity';
import type { CreateProgressPayload } from '@core/domain/progress/entity/type/CreateProgressPayload';

export class Progress extends Entity<string> {
  private userId: string;
  private courseId: string;
  private completedLectures: Set<string>;

  constructor(payload: CreateProgressPayload) {
    super();
    this.id = payload.id;
    this.userId = payload.userId;
    this.courseId = payload.courseId;
    this.completedLectures = payload.completedLectures;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getCourseId(): string {
    return this.courseId;
  }

  public getCompletedLectures(): string[] {
    return Array.from(this.completedLectures);
  }

  public addLecture(lectureId: string): void {
    this.completedLectures.add(lectureId);
  }

  public removeLecture(lectureId: string): void {
    this.completedLectures.delete(lectureId);
  }

  public isLectureCompleted(lectureId: string): boolean {
    return this.completedLectures.has(lectureId);
  }

  public static new(payload: CreateProgressPayload): Progress {
    const progress: Progress = new Progress(payload);
    return progress;
  }
}
