import type { DailyAvailabilityConfig } from '@/domain/entities/session-settings.entity';

export interface SessionSettingsDto {
  price: number;
  currency: string;
  duration: number;
  weeklySchedules: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}
