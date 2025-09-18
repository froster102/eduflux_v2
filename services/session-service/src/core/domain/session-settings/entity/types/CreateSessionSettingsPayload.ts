import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';

export type CreateSessionSettingsPayload = {
  id: string;
  instructorId: string;
  isSessionEnabled: boolean;
  price: number;
  currency: string;
  duration: number;
  template: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
};
