import { DailyAvailabilityConfig } from './daily-availability-config.dto';

export interface ScheduleSettingDto {
  weeklySchedule: DailyAvailabilityConfig[];
  slotDurationMinutes: number;
  applyForWeeks: number;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}
