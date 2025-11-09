import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';

export interface EnableSessionPort {
  price: number;
  executorId: string;
  weeklySchedules: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
}
