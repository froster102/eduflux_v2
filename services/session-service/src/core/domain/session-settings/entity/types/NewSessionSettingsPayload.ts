import type { DailyAvailabilityConfig } from '@core/domain/session-settings/entity/types/DailyAvailabilityConfig';

export type NewSessionSettingsPayload = {
  id: string;
  instructorId: string;
  price: number;
  currency: string;
  duration: number;
  isSessionEnabled: boolean;
  weeklySchedules: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
};
