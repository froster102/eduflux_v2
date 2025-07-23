import { DailyAvailabilityConfig } from '@/application/use-cases/update-instructor-weekly-availablity.use-case';

export class ScheduleSetting {
  private readonly _id: string;
  private readonly _instructorId: string;
  private _weeklyAvailabilityTemplate: DailyAvailabilityConfig[];
  private _slotDurationMinutes: number;
  private _applyForWeeks: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    instructorId: string,
    weeklyAvailabilityTemplate: DailyAvailabilityConfig[],
    slotDurationMinutes: number,
    applyForWeeks: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._instructorId = instructorId;
    this._weeklyAvailabilityTemplate = weeklyAvailabilityTemplate;
    this._slotDurationMinutes = slotDurationMinutes;
    this._applyForWeeks = applyForWeeks;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(
    instructorId: string,
    template: DailyAvailabilityConfig[],
    duration: number,
    applyForWeeks: number,
  ): ScheduleSetting {
    const now = new Date();
    return new ScheduleSetting(
      instructorId,
      instructorId,
      template,
      duration,
      applyForWeeks,
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
    createdAt: Date,
    updatedAt: Date,
  ): ScheduleSetting {
    return new ScheduleSetting(
      id,
      instructorId,
      weeklyAvailabilityTemplate,
      slotDurationMinutes,
      applyForWeeks,
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
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
