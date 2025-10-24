import { Entity } from '@core/common/entity/Entity';
import type { CreateEnrollmentPayload } from '@core/domain/enrollment/entity/types/CreateEnrollmentPayload';
import { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';

export class Enrollment extends Entity<string> {
  private readonly _courseId: string;
  private readonly _learnerId: string;
  private readonly _instructorId: string;
  private _status: EnrollmentStatus;
  private _paymentId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(payload: CreateEnrollmentPayload) {
    super(payload.id);
    this._learnerId = payload.learnerId;
    this._courseId = payload.courseId;
    this._status = payload.status;
    this._instructorId = payload.instructorId;
    this._paymentId = payload.paymentId;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  get learnerId(): string {
    return this._learnerId;
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
  get instructorId(): string {
    return this._instructorId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsCompleted(paymentId: string): void {
    this._status = EnrollmentStatus.COMPLETED;
    this._paymentId = paymentId;
    this._updatedAt = new Date();
  }

  markAsFailed(paymentId: string): void {
    this._status = EnrollmentStatus.FAILED;
    this._paymentId = paymentId;
    this._updatedAt = new Date();
  }

  markAsRefunded(): void {
    if (this.status !== EnrollmentStatus.COMPLETED) {
      throw new Error('Only completed enrollments can be refunded.');
    }
    this._status = EnrollmentStatus.REFUNDED;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  static create(payload: CreateEnrollmentPayload): Enrollment {
    return new Enrollment(payload);
  }

  static new(payload: CreateEnrollmentPayload): Enrollment {
    return new Enrollment(payload);
  }
}
