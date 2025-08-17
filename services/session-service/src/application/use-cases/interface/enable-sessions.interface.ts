import type { DailyAvailabilityConfig } from '@/domain/entities/session-settings.entity';
import type { IUseCase } from './use-case.interface';

export interface EnableSessionInput {
  price: number;
  executorId: string;
  weeklySchedules: DailyAvailabilityConfig[];
  applyForWeeks: number;
  timeZone: string;
}

export interface IEnableSessionsUseCase
  extends IUseCase<EnableSessionInput, void> {}
