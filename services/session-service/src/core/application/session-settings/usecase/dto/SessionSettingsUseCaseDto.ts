import type { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';

export class SessionSettingsUseCaseDto {
  readonly instructorId: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: number;
  readonly weeklySchedules: DailyAvailabilityConfig[];
  readonly applyForWeeks: number;
  readonly timeZone: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(sessionSettings: SessionSettings) {
    this.instructorId = sessionSettings.instructorId;
    this.price = sessionSettings.price;
    this.currency = sessionSettings.currency;
    this.duration = sessionSettings.duration;
    this.weeklySchedules = sessionSettings.weeklySchedules;
    this.applyForWeeks = sessionSettings.applyForWeeks;
    this.timeZone = sessionSettings.timeZone;
    this.createdAt = sessionSettings.createdAt;
    this.updatedAt = sessionSettings.updatedAt;
  }

  static fromEntity(
    sessionSettings: SessionSettings,
  ): SessionSettingsUseCaseDto {
    return new SessionSettingsUseCaseDto(sessionSettings);
  }

  static fromEntities(
    sessionSettingsList: SessionSettings[],
  ): SessionSettingsUseCaseDto[] {
    return sessionSettingsList.map((sessionSettings) =>
      this.fromEntity(sessionSettings),
    );
  }
}
