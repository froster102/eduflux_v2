import { DomainException } from '../exceptions/domain.exception';

export enum SessionStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
  INSTRUCTOR_NO_SHOW = 'INSTRUCTOR_NO_SHOW',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
}

export interface SessionProps {
  id: string;
  instructorId: string;
  learnerId: string;
  availabilitySlotId: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  paymentId: string | null;
  pendingPaymentExpiryTime: Date | null;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  private _id: string;
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

  private constructor(props: SessionProps) {
    this._id = props.id;
    this._instructorId = props.instructorId;
    this._learnerId = props.learnerId;
    this._availabilitySlotId = props.availabilitySlotId;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._status = props.status;
    this._paymentId = props.paymentId || null;
    this._pendingPaymentExpiryTime = props.pendingPaymentExpiryTime;
    this._price = props.price;
    this._currency = props.currency;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<SessionProps, 'createdAt' | 'updatedAt' | 'paymentId'>,
  ) {
    return new Session({
      ...props,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: SessionProps): Session {
    return new Session(props);
  }

  get id(): string {
    return this._id;
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

  markAsBooked(paymentId: string): void {
    if (this._status !== SessionStatus.PENDING_PAYMENT) {
      throw new DomainException('Session is not in pending payment state.');
    }
    this._status = SessionStatus.BOOKED;
    this._paymentId = paymentId;
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
    if (
      this._status === SessionStatus.CANCELLED ||
      this._status === SessionStatus.COMPLETED ||
      this._status === SessionStatus.NO_SHOW ||
      this._status === SessionStatus.INSTRUCTOR_NO_SHOW
    ) {
      throw new DomainException(
        'Cannot reschedule a cancelled, completed, or no-show session.',
      );
    }
    this._availabilitySlotId = newAvailabilitySlotId;
    this._startTime = newStartTime;
    this._endTime = newEndTime;
    this._status = SessionStatus.RESCHEDULED;
    this._updatedAt = new Date();
  }

  markAsNoShow(): void {
    if (
      this._status !== SessionStatus.BOOKED &&
      this._status !== SessionStatus.IN_PROGRESS
    ) {
      throw new DomainException(
        'Cannot mark a session as NO_SHOW if not BOOKED or IN_PROGRESS.',
      );
    }
    this._status = SessionStatus.NO_SHOW;
    this._updatedAt = new Date();
  }

  markAsInstructorNoShow(): void {
    if (
      this._status !== SessionStatus.BOOKED &&
      this._status !== SessionStatus.IN_PROGRESS
    ) {
      throw new DomainException(
        'Cannot mark a session as INSTRUCTOR_NO_SHOW if not BOOKED or IN_PROGRESS.',
      );
    }
    this._status = SessionStatus.INSTRUCTOR_NO_SHOW;
    this._updatedAt = new Date();
  }

  markAsPaymentExpired(): void {
    if (this._status !== SessionStatus.PENDING_PAYMENT) {
      throw new DomainException(
        'Cannot mark a session as PAYMENT_EXPIRED if not PENDING_PAYMENT.',
      );
    }
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
}
