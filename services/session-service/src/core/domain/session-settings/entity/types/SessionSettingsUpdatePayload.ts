import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';

export type SessionSettingsUpdatePayload = {
  price?: number;
  weeklySchedules?: DailyAvailabilityConfig[];
  slotDurationMinutes?: number;
  applyForWeeks?: number;
  timeZone?: string;
};
