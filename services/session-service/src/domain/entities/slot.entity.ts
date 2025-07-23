import { DomainException } from '../exceptions/domain.exception';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
}

export interface SlotProps {
  id: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  bookedById: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSlotProps {
  id: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  bookedById: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Slot {
  private _id: string;
  private readonly _instructorId: string;
  private _startTime: Date;
  private _endTime: Date;
  private _status: SlotStatus;
  private _bookedById: string | null;
  private _sessionId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SlotProps) {
    this._id = props.id;
    this._instructorId = props.instructorId;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._status = props.status;
    this._bookedById = props.bookedById || null;
    this._sessionId = props.sessionId || null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }
  get instructorId() {
    return this._instructorId;
  }
  get startTime() {
    return this._startTime;
  }
  get endTime() {
    return this._endTime;
  }
  get status() {
    return this._status;
  }
  get bookedById() {
    return this._bookedById;
  }
  get sessionId() {
    return this._sessionId;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  static create(
    props: Omit<
      CreateSlotProps,
      'createdAt' | 'updatedAt' | 'status' | 'bookedById' | 'sessionId'
    >,
  ) {
    return new Slot({
      ...props,
      bookedById: null,
      sessionId: null,
      status: SlotStatus.AVAILABLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: SlotProps): Slot {
    return new Slot(props);
  }

  markAsBooked(studentId: string, sessionId: string): void {
    if (this._status !== SlotStatus.AVAILABLE) {
      throw new DomainException('Slot is not available for booking.');
    }
    this._status = SlotStatus.BOOKED;
    this._bookedById = studentId;
    this._sessionId = sessionId;
    this._updatedAt = new Date();
  }

  markAsAvailable(): void {
    if (this._status !== SlotStatus.BOOKED) {
      throw new Error('Availability slot is not booked.');
    }
    this._status = SlotStatus.AVAILABLE;
    this._bookedById = null;
    this._sessionId = null;
    this._updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this._status === SlotStatus.AVAILABLE;
  }
}
