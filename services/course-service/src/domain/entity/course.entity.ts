import { v4 as uuidv4 } from 'uuid';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseStatus =
  | 'draft'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'in_review'
  | 'approved'
  | 'rejected';

export interface Instructor {
  readonly id: string;
  readonly name: string;
}

interface CreateCourseProps {
  title: string;
  instructor: Instructor;
}

interface PersistedCourseProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  level: CourseLevel | null;
  price: string | null;
  isFree: boolean;
  status: CourseStatus;
  feedback: string | null;
  instructor: Instructor;
  averageRating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

interface UpdateCourseDetailsProps {
  title?: string;
  description?: string;
  thumbnail?: string | null;
  level?: CourseLevel;
  price?: string | null;
  isFree?: boolean;
}

export class Course {
  private _id: string;
  private _title: string;
  private _description: string;
  private _thumbnail: string | null;
  private _level: CourseLevel | null;
  private _level: 'beginner' | 'intermediate' | 'advanced';
  private _price: string | null;
  private _isFree: boolean;
  private _status: CourseStatus;
  private _feedback: string | null;
  private _instructor: Instructor;
  private _averageRating: number;
  private _ratingCount: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _publishedAt: Date | null;

  private constructor(props: PersistedCourseProps) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._thumbnail = props.thumbnail;
    this._level = props.level;
  private constructor(
    id: string,
    title: string,
    description: string,
    thumbnail: string | null = null,
    level: 'beginner' | 'intermediate' | 'advanced',
    price: string | null = null,
    isFree: boolean = false,
    status: Status = 'draft',
    feedback: string | null = null,
    instructor: { id: string; name: string },
    averageRating: number,
    ratingCount: number,
    publishedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._thumbnail = thumbnail;
    this._level = level;
    this._price = price;
    this._isFree = isFree;
    this._status = status;
    this._feedback = feedback;
    this._instructor = instructor;
    this._averageRating = averageRating;
    this._ratingCount = ratingCount;
    this._publishedAt = publishedAt;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._price = props.price;
    this._isFree = props.isFree;
    this._status = props.status;
    this._feedback = props.feedback;
    this._instructor = { ...props.instructor };
    this._averageRating = props.averageRating;
    this._ratingCount = props.ratingCount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._publishedAt = props.publishedAt;
  }

  static create(props: CreateCourseProps): Course {
    const now = new Date();

    return new Course({
      id: uuidv4(),
      title: props.title,
      description: '',
      thumbnail: null,
      level: null,
    return new Course(
      uuidv4(),
      title,
      description,
      null,
      level,
      null,
      false,
      'draft',
      null,
      instructor,
      0,
      0,
      null,
      now,
      now,
    );
  }

  static fromPersistence(
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    price: string | null,
    isFree: boolean,
    status: Status = 'draft',
    feedback: string | null,
    instructor: { id: string; name: string },
    averageRating: number,
    ratingCount: number,
    createdAt: Date,
    publishedAt: Date | null = null,
    updatedAt: Date,
  ): Course {
    return new Course(
      id,
      title,
      description,
      thumbnail,
      level,
      price,
      isFree,
      status,
      feedback,
      instructor,
      averageRating,
      ratingCount,
      publishedAt,
      createdAt,
      updatedAt,
    );
      price: null,
      isFree: false,
      status: 'draft',
      feedback: null,
      instructor: props.instructor,
      averageRating: 0,
      ratingCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    });
  }

  static fromPersistence(props: PersistedCourseProps): Course {
    return new Course(props);
  }

  get id(): string {
    return this._id;
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

  get priceTierId(): string | null {
  get price(): string | null {
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
  get instructor(): Instructor {
    return { ...this._instructor };
  }
  get averageRating(): number {
    return this._averageRating;
  }
  get ratingCount(): number {
    return this._ratingCount;
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

  updateDetails(props: UpdateCourseDetailsProps): void {
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

  updateDetails(
    newTitle: string,
    newDescription: string,
    newThumbnail: string,
    newLevel: 'beginner' | 'intermediate' | 'advanced',
  ): void {
    this._title = newTitle;
    this._description = newDescription;
    this._thumbnail = newThumbnail;
    this._level = newLevel;
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

  submitForReview(): void {
    if (this._status === 'draft' || this._status === 'rejected') {
      this._status = 'in_review';
      this._feedback = null;
      this._updatedAt = new Date();
    }
  }

  approve(): void {
    if (this._status === 'in_review') {
      this._status = 'approved';
      this._updatedAt = new Date();
    }
  }

  reject(feedback: string): void {
    if (this._status === 'in_review') {
      if (!feedback || feedback.trim() === '') {
        throw new Error('Feedback is required to reject a course.');
      }
      this._status = 'rejected';
      this._feedback = feedback;
      this._updatedAt = new Date();
    }
  }

  publish(): void {
    if (this._status === 'approved') {
      this._status = 'published';
      this._updatedAt = new Date();
      this._publishedAt = new Date();
    }
  }

  unpublish(): void {
    if (this._status === 'published') {
      this._status = 'unpublished';
      this._updatedAt = new Date();
    } else {
      console.warn(`Cannot unpublish course from status: ${this._status}`);
    }
  }

  archive(): void {
    if (this._status === 'published' || this._status === 'unpublished') {
      this._status = 'archived';
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

  toJSON(): object {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      thumbnail: this._thumbnail,
      level: this._level,
      price: this._price,
      isFree: this._isFree,
      status: this._status,
      feedback: this._feedback,
      instructor: { id: this._instructor.id, name: this._instructor.name },
      averageRating: this._averageRating,
      ratingCount: this._ratingCount,
      publishedAt: this._publishedAt?.toISOString() ?? null,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
