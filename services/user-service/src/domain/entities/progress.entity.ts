import { AppErrorCode } from '@/shared/errors/error-code';
import { DomainException } from '../exceptions/domain.exception';

export class Progress {
  private _id: string;
  private _userId: string;
  private _courseId: string;
  private _completedLectures: Set<string>;

  private constructor(
    id: string,
    userId: string,
    courseId: string,
    completedLectures: Set<string>,
  ) {
    if (!id || !userId || !courseId) {
      throw new DomainException(
        'ID, User ID, and Course ID cannot be empty.',
        AppErrorCode.INVALID_INPUT,
      );
    }

    this._id = id;
    this._userId = userId;
    this._courseId = courseId;
    this._completedLectures = completedLectures;
  }

  static create(id: string, userId: string, courseId: string) {
    return new Progress(id, userId, courseId, new Set<string>());
  }

  static fromPersistence(
    id: string,
    userId: string,
    courseId: string,
    completedLectures: string[],
  ) {
    if (!Array.isArray(completedLectures)) {
      throw new DomainException(
        'Completed lectures from persistence must be an array.',
        AppErrorCode.INVALID_INPUT,
      );
    }
    return new Progress(id, userId, courseId, new Set(completedLectures));
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get courseId(): string {
    return this._courseId;
  }

  get completedLectures(): string[] {
    return Array.from(this._completedLectures);
  }

  addLecture(lectureId: string): void {
    if (!lectureId) {
      throw new DomainException(
        'Lecture ID cannot be empty.',
        AppErrorCode.INVALID_INPUT,
      );
    }
    this._completedLectures.add(lectureId);
  }

  removeLecture(lectureId: string): void {
    if (!lectureId) {
      throw new DomainException(
        'Lecture ID cannot be empty.',
        AppErrorCode.INVALID_INPUT,
      );
    }
    this._completedLectures.delete(lectureId);
  }

  isLectureCompleted(lectureId: string): boolean {
    return this._completedLectures.has(lectureId);
  }
}
