import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';

export interface UnitOfWork {
  slotRepository: SlotRepositoryPort;
  sessionRepository: SessionRepositoryPort;
  sessionSettingsRepository: SessionSettingsRepositoryPort;

  runTransaction<T>(callback: (uow: UnitOfWork) => Promise<T>): Promise<T>;
  rollback(): Promise<void>;
}
