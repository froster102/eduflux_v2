import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import { MongooseSessionSettingsMapper } from '@infrastructure/adapter/persistence/mongoose/model/session-settings/mapper/MongooseSessionSettingsMapper';
import {
  SessionSettingsModel,
  type MongooseSessionSettings,
} from '@infrastructure/adapter/persistence/mongoose/model/session-settings/MongooseSessionSettings';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';

export class MongooseSessionSettingsRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<
    SessionSettings,
    MongooseSessionSettings
  >
  implements SessionSettingsRepositoryPort
{
  constructor(@unmanaged() session?: ClientSession) {
    super(SessionSettingsModel, MongooseSessionSettingsMapper, session);
  }

  async findByUserId(userId: string): Promise<SessionSettings | null> {
    const scheduleSetting = await SessionSettingsModel.findOne({
      instructorId: userId,
    });

    return scheduleSetting
      ? MongooseSessionSettingsMapper.toDomain(scheduleSetting)
      : null;
  }
}
