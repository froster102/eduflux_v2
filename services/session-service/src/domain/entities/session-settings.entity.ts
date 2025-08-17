export interface DailyAvailabilityConfig {
  dayOfWeek: number;
  enabled: boolean;
  startTime?: string;
  endTime?: string;
}

export interface SessionPricing {
  price: number;
  currency: string;
  durationMinutes: number;
}

interface SessionSettingsUpdateProps {
  price?: number;
  weeklySchedules?: DailyAvailabilityConfig[];
  slotDurationMinutes?: number;
  applyForWeeks?: number;
  timeZone?: string;
}

export class SessionSettings {
  private readonly _id: string;
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

  private constructor(
    id: string,
    instructorId: string,
    price: number,
    currency: string,
    duration: number,
    isSessionEnabled: boolean,
    weeklySchedules: DailyAvailabilityConfig[],
    applyForWeeks: number,
    timeZone: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._instructorId = instructorId;
    this._price = price;
    this._currency = currency;
    this._duration = duration;
    this._isSessionEnabled = isSessionEnabled;
    this._weeklySchedules = weeklySchedules;
    this._applyForWeeks = applyForWeeks;
    this._timeZone = timeZone;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(
    instructorId: string,
    isSessionEnabled: boolean,
    price: number,
    currency: string,
    duration: number,
    template: DailyAvailabilityConfig[],
    applyForWeeks: number,
    timeZone: string,
  ): SessionSettings {
    const now = new Date();
    return new SessionSettings(
      instructorId,
      instructorId,
      price,
      currency,
      duration,
      isSessionEnabled,
      template,
      applyForWeeks,
      timeZone,
      now,
      now,
    );
  }

  public static fromPersistence(
    id: string,
    instructorId: string,
    price: number,
    currency: string,
    duration: number,
    isSessionEnabled: boolean,
    weeklyAvailabilityTemplate: DailyAvailabilityConfig[],
    applyForWeeks: number,
    timeZone: string,
    createdAt: Date,
    updatedAt: Date,
  ): SessionSettings {
    return new SessionSettings(
      id,
      instructorId,
      price,
      currency,
      duration,
      isSessionEnabled,
      weeklyAvailabilityTemplate,
      applyForWeeks,
      timeZone,
      createdAt,
      updatedAt,
    );
  }

  public get id(): string {
    return this._id;
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
  public update(props: SessionSettingsUpdateProps) {
    let updated = false;
    if (props.price) {
      this._price = props.price;
      updated = true;
    }
    if (props.weeklySchedules) {
      this._weeklySchedules = props.weeklySchedules;
      updated = true;
    }

    if (props.applyForWeeks) {
      this._applyForWeeks = props.applyForWeeks;
    }
    if (props.timeZone) {
      this._timeZone = props.timeZone;
      updated = true;
    }
    if (updated) {
      this._updatedAt = new Date();
    }
  }
}
