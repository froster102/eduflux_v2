import { SessionSettings } from '../entities/session-settings.entity';
import type { IBaseRepository } from './base.repository';

export interface ISessionSettingsRepository
  extends IBaseRepository<SessionSettings> {
  findByUserId(userId: string): Promise<SessionSettings | null>;
}
