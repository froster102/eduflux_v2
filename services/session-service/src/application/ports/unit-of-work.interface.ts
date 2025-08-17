import type { ISessionSettingsRepository } from '@/domain/repositories/session-settings.repository';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import type { ISlotRepository } from '@/domain/repositories/slot.repository';

export interface IUnitOfWork {
  slotRepository: ISlotRepository;
  sessionRepository: ISessionRepository;
  sessionSettingsRepository: ISessionSettingsRepository;

  runTransaction<T>(callback: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
  rollback(): Promise<void>;
}
