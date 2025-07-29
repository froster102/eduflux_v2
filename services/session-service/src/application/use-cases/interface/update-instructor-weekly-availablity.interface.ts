import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';

export interface DailyAvailabilityConfig {
  dayOfWeek: number;
  enabled: boolean;
  startTime?: string;
  endTime?: string;
}

export interface UpdateInstructorWeeklyAvailabilityInput {
  actor: AuthenticatedUserDto;
  weeklySchedule: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
}

export interface IUpdateInstructorWeeklyAvailabilityUseCase
  extends IUseCase<UpdateInstructorWeeklyAvailabilityInput, void> {}
