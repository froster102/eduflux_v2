import { Entity } from '@core/common/entity/Entity';
import type { CreateSlotPayload } from '@core/domain/slot/entity/types/CreateSlotPayload';
import type { NewSlotPayload } from '@core/domain/slot/entity/types/NewSlotPayload';
import { SlotStatus } from '@core/domain/slot/enum/SlotStatus';

export class Slot extends Entity<string> {
  private readonly _instructorId: string;
  private _startTime: Date;
  private _endTime: Date;
  private _status: SlotStatus;
  private _bookedById: string | null;
  private _sessionId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(payload: NewSlotPayload) {
    super(payload.id);
    this._instructorId = payload.instructorId;
    this._startTime = payload.startTime;
    this._endTime = payload.endTime;
    this._status = payload.status;
    this._bookedById = payload.bookedById || null;
    this._sessionId = payload.sessionId || null;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
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

  markAsBooked(studentId: string, sessionId: string): void {
    this._status = SlotStatus.BOOKED;
    this._bookedById = studentId;
    this._sessionId = sessionId;
    this._updatedAt = new Date();
  }

  markAsAvailable(): void {
    this._status = SlotStatus.AVAILABLE;
    this._bookedById = null;
    this._sessionId = null;
    this._updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this._status === SlotStatus.AVAILABLE;
  }

  static create(payload: CreateSlotPayload) {
    return new Slot({
      ...payload,
      bookedById: null,
      sessionId: null,
      status: SlotStatus.AVAILABLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static new(payload: NewSlotPayload): Slot {
    return new Slot(payload);
  }
}
