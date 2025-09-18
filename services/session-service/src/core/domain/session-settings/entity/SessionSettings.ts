import { Entity } from '@core/common/entity/Entity';
import type { CreateSessionSettingsPayload } from '@core/domain/session-settings/entity/types/CreateSessionSettingsPayload';
import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';
import type { NewSessionSettingsPayload } from '@core/domain/session-settings/entity/types/NewSessionSettingsPayload';
import type { SessionSettingsUpdatePayload } from '@core/domain/session-settings/entity/types/SessionSettingsUpdatePayload';

export class SessionSettings extends Entity<string> {
  private readonly _instructorId: string;
  private _price: number;
  private _currency: string;
  private _duration: number;
  private _isSessionEnabled: boolean;
  private _weeklySchedules: DailyAvailabilityConfig[];
  private _applyForWeeks: number;
  private _timeZone: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(payload: NewSessionSettingsPayload) {
    super(payload.id);
    this._instructorId = payload.instructorId;
    this._price = payload.price;
    this._currency = payload.currency;
    this._duration = payload.duration;
    this._isSessionEnabled = payload.isSessionEnabled;
    this._weeklySchedules = payload.weeklySchedules;
    this._applyForWeeks = payload.applyForWeeks;
    this._timeZone = payload.timeZone;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  public get instructorId(): string {
    return this._instructorId;
  }
  public get price(): number {
    return this._price;
  }
  public get currency(): string {
    return this._currency;
  }
  public get duration(): number {
    return this._duration;
  }
  public get isSessionEnabled(): boolean {
    return this._isSessionEnabled;
  }
  public get weeklySchedules(): DailyAvailabilityConfig[] {
    return this._weeklySchedules;
  }

  public get applyForWeeks(): number {
    return this._applyForWeeks;
  }
  public get timeZone(): string {
    return this._timeZone;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  //Refactor when adding user duration setting functionality
  public update(payload: SessionSettingsUpdatePayload) {
    let updated = false;
    if (payload.price) {
      this._price = payload.price;
      updated = true;
    }
    if (payload.weeklySchedules) {
      this._weeklySchedules = payload.weeklySchedules;
      updated = true;
    }

    if (payload.applyForWeeks) {
      this._applyForWeeks = payload.applyForWeeks;
    }
    if (payload.timeZone) {
      this._timeZone = payload.timeZone;
      updated = true;
    }
    if (updated) {
      this._updatedAt = new Date();
    }
  }

  public static create(payload: CreateSessionSettingsPayload): SessionSettings {
    const now = new Date();
    return new SessionSettings({
      ...payload,
      weeklySchedules: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  public static new(payload: NewSessionSettingsPayload): SessionSettings {
    return new SessionSettings(payload);
  }
}
