import { IScheduleSettingRepository } from '@/domain/repositories/schedule-setting.repository';
import { ISessionRepository } from '@/domain/repositories/session.repository';
import { ISlotRepository } from '@/domain/repositories/slot.repository';

export interface IUnitOfWork {
  slotRepository: ISlotRepository;
  sessionRepository: ISessionRepository;
  scheduleSettingRepository: IScheduleSettingRepository;

  runTransaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
  rollback(): Promise<void>;
}
