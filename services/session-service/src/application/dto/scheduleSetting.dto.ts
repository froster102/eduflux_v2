import { DailyAvailabilityConfig } from '@/domain/entities/schedule-setting.entity';

export interface ScheduleSettingDto {
  weeklySchedule: DailyAvailabilityConfig[];
  slotDurationMinutes: number;
  applyForWeeks: number;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}
