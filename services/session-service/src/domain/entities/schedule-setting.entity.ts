export interface DailyAvailabilityConfig {
  dayOfWeek: number;
  enabled: boolean;
  startTime?: string;
  endTime?: string;
}

export class ScheduleSetting {
  private readonly _id: string;
  private readonly _instructorId: string;
  private _weeklyAvailabilityTemplate: DailyAvailabilityConfig[];
  private _slotDurationMinutes: number;
  private _applyForWeeks: number;
  private _timeZone: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    instructorId: string,
    weeklyAvailabilityTemplate: DailyAvailabilityConfig[],
    slotDurationMinutes: number,
    applyForWeeks: number,
    timeZone: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._instructorId = instructorId;
    this._weeklyAvailabilityTemplate = weeklyAvailabilityTemplate;
    this._slotDurationMinutes = slotDurationMinutes;
    this._applyForWeeks = applyForWeeks;
    this._timeZone = timeZone;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(
    instructorId: string,
    template: DailyAvailabilityConfig[],
    duration: number,
    applyForWeeks: number,
    timeZone: string,
  ): ScheduleSetting {
    const now = new Date();
    return new ScheduleSetting(
      instructorId,
      instructorId,
      template,
      duration,
      applyForWeeks,
      timeZone,
      now,
      now,
    );
  }

  public static fromPersistence(
    id: string,
    instructorId: string,
    weeklyAvailabilityTemplate: DailyAvailabilityConfig[],
    slotDurationMinutes: number,
    applyForWeeks: number,
    timeZone: string,
    createdAt: Date,
    updatedAt: Date,
  ): ScheduleSetting {
    return new ScheduleSetting(
      id,
      instructorId,
      weeklyAvailabilityTemplate,
      slotDurationMinutes,
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
  public get weeklyAvailabilityTemplate(): DailyAvailabilityConfig[] {
    return this._weeklyAvailabilityTemplate;
  }
  public get slotDurationMinutes(): number {
    return this._slotDurationMinutes;
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

  public updateTemplate(
    template: DailyAvailabilityConfig[],
    duration: number,
    applyForWeeks: number,
  ): void {
    this._weeklyAvailabilityTemplate = template;
    this._slotDurationMinutes = duration;
    this._applyForWeeks = applyForWeeks;
    this._updatedAt = new Date();
  }

  public toJSON(): object {
    return {
      id: this.id,
      instructorId: this.instructorId,
      weeklyAvailabilityTemplate: this.weeklyAvailabilityTemplate,
      slotDurationMinutes: this.slotDurationMinutes,
      applyForWeeks: this.applyForWeeks,
      timeZone: this.timeZone,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
