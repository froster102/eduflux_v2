import { Entity } from '@core/common/entity/Entity';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import type { CreateSessionPayload } from '@core/domain/session/entity/types/CreateSessionPayload';
import type { NewSessionPayload } from '@core/domain/session/entity/types/NewSessionPayload';

export class Session extends Entity<string> {
  private readonly _instructorId: string;
  private readonly _learnerId: string;
  private _availabilitySlotId: string;
  private _startTime: Date;
  private _endTime: Date;
  private _status: SessionStatus;
  private _paymentId: string | null;
  private _pendingPaymentExpiryTime: Date | null;
  private readonly _price: number;
  private _currency: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(payload: NewSessionPayload) {
    super(payload.id);
    this._instructorId = payload.instructorId;
    this._learnerId = payload.learnerId;
    this._availabilitySlotId = payload.availabilitySlotId;
    this._startTime = payload.startTime;
    this._endTime = payload.endTime;
    this._status = payload.status;
    this._paymentId = payload.paymentId || null;
    this._pendingPaymentExpiryTime = payload.pendingPaymentExpiryTime;
    this._price = payload.price;
    this._currency = payload.currency;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  get instructorId(): string {
    return this._instructorId;
  }

  get learnerId(): string {
    return this._learnerId;
  }

  get availabilitySlotId(): string {
    return this._availabilitySlotId;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get status(): SessionStatus {
    return this._status;
  }

  get paymentId(): string | null {
    return this._paymentId;
  }

  get pendingPaymentExpiryTime(): Date | null {
    return this._pendingPaymentExpiryTime;
  }

  get price(): number {
    return this._price;
  }

  get currency(): string {
    return this._currency;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsBooked(): void {
    this._status = SessionStatus.BOOKED;
    this._updatedAt = new Date();
  }

  markAsConfirmed(paymentId: string): void {
    this._status = SessionStatus.CONFIRMED;
    this._paymentId = paymentId;
    this._updatedAt = new Date();
  }

  markAsCompleted(): void {
    this._status = SessionStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  markAsCancelled(): void {
    this._status = SessionStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  markAsRescheduled(
    newAvailabilitySlotId: string,
    newStartTime: Date,
    newEndTime: Date,
  ): void {
    this._availabilitySlotId = newAvailabilitySlotId;
    this._startTime = newStartTime;
    this._endTime = newEndTime;
    this._status = SessionStatus.RESCHEDULED;
    this._updatedAt = new Date();
  }

  markAsNoShow(): void {
    this._status = SessionStatus.NO_SHOW;
    this._updatedAt = new Date();
  }

  markAsProgress(): void {
    this._status = SessionStatus.IN_PROGRESS;
    this._updatedAt = new Date();
  }

  markAsInstructorNoShow(): void {
    this._status = SessionStatus.INSTRUCTOR_NO_SHOW;
    this._updatedAt = new Date();
  }

  markAsPaymentExpired(): void {
    this._status = SessionStatus.PAYMENT_EXPIRED;
    this._pendingPaymentExpiryTime = null;
    this._updatedAt = new Date();
  }

  isInstructor(userId: string): boolean {
    return this.instructorId === userId;
  }

  isLearner(userId: string): boolean {
    return this._learnerId === userId;
  }

  isParticipant(userId: string): boolean {
    return this._learnerId === userId || this._instructorId === userId;
  }

  static create(payload: CreateSessionPayload) {
    return new Session({
      ...payload,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static new(payload: NewSessionPayload): Session {
    return new Session(payload);
  }
}
