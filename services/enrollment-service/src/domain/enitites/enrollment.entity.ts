import { AppErrorCode } from '@/shared/errors/error-code';
import { DomainException } from '../exceptions/domain.exception';

export type EnrollmentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

interface CreateEnrollmentProps {
  id: string;
  userId: string;
  courseId: string;
}

interface PersistedEnrollmentProps {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Enrollment {
  private _id: string;
  private _userId: string;
  private _courseId: string;
  private _status: EnrollmentStatus;
  private _paymentId: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    userId: string,
    courseId: string,
    status: EnrollmentStatus,
    paymentId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._courseId = courseId;
    this._status = status;
    this._paymentId = paymentId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(props: CreateEnrollmentProps) {
    const now = new Date();
    return new Enrollment(
      props.id,
      props.userId,
      props.courseId,
      'PENDING',
      null,
      now,
      now,
    );
  }

  static fromPersistence(props: PersistedEnrollmentProps) {
    return new Enrollment(
      props.id,
      props.userId,
      props.courseId,
      props.status,
      props.paymentId,
      props.createdAt,
      props.updatedAt,
    );
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
  get status(): EnrollmentStatus {
    return this._status;
  }
  get paymentId(): string | null {
    return this._paymentId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsCompleted(paymentId: string): void {
    if (this._status === 'COMPLETED') {
      throw new DomainException(
        'Enrollment is already completed',
        AppErrorCode.INVALID_INPUT,
      );
    }
    this._status = 'COMPLETED';
    this._paymentId = paymentId;
    this._updatedAt = new Date();
  }

  markAsFailed(paymentId: string): void {
    if (this._status === 'COMPLETED' || this._status === 'FAILED') {
      throw new DomainException(
        'Cannot mark a completed or already failed enrollment as failed.',
        AppErrorCode.INVALID_INPUT,
      );
    }
    this._status = 'FAILED';
    this._paymentId = paymentId;
    this._updatedAt = new Date();
  }

  markAsRefunded(): void {
    if (this.status !== 'COMPLETED') {
      throw new Error('Only completed enrollments can be refunded.');
    }
    this._status = 'REFUNDED';
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === 'COMPLETED';
  }
}
