import { Entity } from '@core/common/entity/Entity';
import { CourseLevel } from '@core/domain/course/enum/CourseLevel';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import type { CreateCoursePayload } from './types/CreateCoursePayload';
import type { NewCoursePayload } from './types/NewCoursePayload';
import type { UpdateCourseDetailsPayload } from './types/UpdateCourseDetailsPayload';

export class Course extends Entity<string> {
  private _title: string;
  private _description: string;
  private _thumbnail: string | null;
  private _level: CourseLevel | null;
  private _categoryId: string;
  private _slug: string;
  private _price: number | null;
  private _isFree: boolean;
  private _status: CourseStatus;
  private _feedback: string | null;
  private readonly _instructor: CreateCoursePayload['instructor'];
  private _averageRating: number;
  private _ratingCount: number;
  private _enrollmentCount: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _publishedAt: Date | null;

  private constructor(payload: NewCoursePayload) {
    super(payload.id);
    this._title = payload.title;
    this._description = payload.description;
    this._thumbnail = payload.thumbnail;
    this._level = payload.level;
    this._categoryId = payload.categoryId;
    this._price = payload.price;
    this._isFree = payload.isFree;
    this._slug = payload.slug;
    this._status = payload.status;
    this._feedback = payload.feedback;
    this._instructor = payload.instructor;
    this._averageRating = payload.averageRating;
    this._ratingCount = payload.ratingCount;
    this._enrollmentCount = payload.enrollmentCount;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
    this._publishedAt = payload.publishedAt;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get thumbnail(): string | null {
    return this._thumbnail;
  }

  get level(): CourseLevel | null {
    return this._level;
  }

  get slug(): string {
    return this._slug;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get price(): number | null {
    return this._price;
  }

  get isFree(): boolean {
    return this._isFree;
  }

  get status(): CourseStatus {
    return this._status;
  }

  get feedback(): string | null {
    return this._feedback;
  }

  get instructor(): CreateCoursePayload['instructor'] {
    return { ...this._instructor };
  }

  get averageRating(): number {
    return this._averageRating;
  }

  get ratingCount(): number {
    return this._ratingCount;
  }

  get enrollmentCount(): number {
    return this._enrollmentCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  updateDetails(props: UpdateCourseDetailsPayload): void {
    let changed = false;

    if (props.title !== undefined && props.title !== this._title) {
      this._title = props.title;
      changed = true;
    }
    if (
      props.description !== undefined &&
      props.description !== this._description
    ) {
      this._description = props.description;
      changed = true;
    }
    if (props.thumbnail !== undefined && props.thumbnail !== this._thumbnail) {
      this._thumbnail = props.thumbnail;
      changed = true;
    }
    if (props.level !== undefined && props.level !== this._level) {
      this._level = props.level;
      changed = true;
    }
    if (
      props.categoryId !== undefined &&
      props.categoryId !== this._categoryId
    ) {
      this._categoryId = props.categoryId;
      changed = true;
    }
    if (props.isFree !== undefined && props.isFree !== this._isFree) {
      this._isFree = props.isFree;
      changed = true;
    }
    if (props.price !== undefined && props.price !== this._price) {
      if (!this._isFree || (this._isFree && props.price === null)) {
        this._price = props.price;
        changed = true;
      }
    }

    if (changed) {
      this._updatedAt = new Date();
    }
  }

  markAsUpdateDraft(): void {
    this._status = CourseStatus.DRAFT_UPDATE;
    this._feedback = null;
    this._updatedAt = new Date();
  }

  submitForReview(): void {
    if (
      this._status === CourseStatus.DRAFT ||
      this._status === CourseStatus.REJECTED ||
      this._status === CourseStatus.DRAFT_UPDATE
    ) {
      this._status = CourseStatus.IN_REVIEW;
      this._feedback = null;
      this._updatedAt = new Date();
    } else {
      throw new Error(`Cannot submit course from status: ${this._status}`);
    }
  }

  approve(): void {
    if (this._status === CourseStatus.IN_REVIEW) {
      this._status = CourseStatus.APPROVED;
      this._updatedAt = new Date();
    }
  }

  reject(feedback: string): void {
    if (this._status === CourseStatus.IN_REVIEW) {
      if (!feedback || feedback.trim() === '') {
        throw new Error('Feedback is required to reject a course.');
      }
      this._status = CourseStatus.REJECTED;
      this._feedback = feedback;
      this._updatedAt = new Date();
    }
  }

  publish(): void {
    this._status = CourseStatus.PUBLISHED;
    this._updatedAt = new Date();
    this._publishedAt = new Date();
  }

  unpublish(): void {
    if (this._status === CourseStatus.PUBLISHED) {
      this._status = CourseStatus.UNPUBLISHED;
      this._updatedAt = new Date();
    }
  }

  archive(): void {
    if (
      this._status === CourseStatus.PUBLISHED ||
      this._status === CourseStatus.UNPUBLISHED
    ) {
      this._status = CourseStatus.ARCHIVED;
      this._updatedAt = new Date();
    }
  }

  updateRating(newAverageRating: number, newRatingCount: number): void {
    if (newAverageRating < 0 || newAverageRating > 5) {
      throw new Error('Average rating must be between 0 and 5.');
    }
    if (newRatingCount < 0) {
      throw new Error('Rating count cannot be negative.');
    }
    this._averageRating = newAverageRating;
    this._ratingCount = newRatingCount;
    this._updatedAt = new Date();
  }

  incrementEnrollmentCount(): void {
    this._enrollmentCount += 1;
    this._updatedAt = new Date();
  }

  static create(payload: CreateCoursePayload): Course {
    const now = new Date();

    return new Course({
      id: crypto.randomUUID(),
      title: payload.title,
      description: '',
      thumbnail: null,
      level: null,
      slug: payload.slug,
      categoryId: payload.categoryId,
      price: null,
      isFree: false,
      status: CourseStatus.DRAFT,
      feedback: null,
      instructor: payload.instructor,
      averageRating: 0,
      ratingCount: 0,
      enrollmentCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    });
  }

  static new(payload: NewCoursePayload): Course {
    return new Course(payload);
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      thumbnail: this._thumbnail,
      level: this._level,
      categoryId: this._categoryId,
      price: this._price,
      isFree: this._isFree,
      status: this._status,
      feedback: this._feedback,
      instructor: {
        id: this._instructor.id,
        name: this._instructor.name,
      },
      slug: this._slug,
      averageRating: this._averageRating,
      ratingCount: this._ratingCount,
      enrollmentCount: this._enrollmentCount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      publishedAt: this._publishedAt,
    };
  }
}
