import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';

export interface SessionSettingsRepositoryPort
  extends BaseRepositoryPort<SessionSettings> {
  findByUserId(userId: string): Promise<SessionSettings | null>;
}
