import { v4 as uuidv4 } from 'uuid';

type Status =
  | 'draft'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'in_review'
  | 'approved'
  | 'rejected';

export class Course {
  private _id: string;
  private _title: string;
  private _description: string;
  private _thumbnail: string | null;
  private _level: 'beginner' | 'intermediate' | 'advanced';
  private _price: string | null;
  private _isFree: boolean;
  private _status: Status;
  private _feedback: string | null;
  private _instructor: { id: string; name: string };
  private _averageRating: number;
  private _ratingCount: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _publishedAt: Date | null;

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
  }

  static create(
    title: string,
    description: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    instructor: { id: string; name: string },
  ): Course {
    const now = new Date();
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

  get level(): 'beginner' | 'intermediate' | 'advanced' {
    return this._level;
  }

  get priceTierId(): string | null {
    return this._price;
  }

  get isFree(): boolean {
    return this._isFree;
  }

  get status(): Status {
    return this._status;
  }

  get instructor(): { id: string; name: string } {
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

  get feedback(): string | null {
    return this._feedback;
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
    this._updatedAt = new Date();
  }

  submitForReview(): void {
    if (this._status === 'draft' || this._status === 'rejected') {
      this._status = 'in_review';
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
    }
  }

  archive(): void {
    if (this._status === 'published') {
      this._status = 'archived';
      this._updatedAt = new Date();
    }
  }

  toJSON(): object {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      thumbnailUrl: this._thumbnail,
      level: this._level,
      price: this._price,
      isFree: this._isFree,
      status: this._status,
      feedback: this._feedback,
      instructor: this._instructor,
      publishedAt: this._publishedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
