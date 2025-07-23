import { DailyAvailabilityConfig } from './daily-availability-config.dto';

export interface ScheduleSettingDto {
  weeklySchedule: DailyAvailabilityConfig[];
  slotDurationMinutes: number;
  applyForWeeks: number;
  createdAt: Date;
  updatedAt: Date;
}
