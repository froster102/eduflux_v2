import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type { ISessionSettingsRepository } from '@/domain/repositories/session-settings.repository';
import type { IMongoScheduleSetting } from '../schema/session-settings.schema';
import type { ClientSession } from 'mongoose';
import { MongoBaseRepository } from './base.repository';
import { TYPES } from '@/shared/di/types';
import { inject, unmanaged } from 'inversify';
import { SessionSettings } from '@/domain/entities/session-settings.entity';
import { ScheduleSettingModel } from '../models/session-settings.model';

export class MongoSessionSettingsRepository
  extends MongoBaseRepository<SessionSettings, IMongoScheduleSetting>
  implements ISessionSettingsRepository
{
  constructor(
    @inject(TYPES.ScheduleSettingMapper)
    private readonly scheduleSettingMapper: IMapper<
      SessionSettings,
      IMongoScheduleSetting
    >,
    @unmanaged() session?: ClientSession,
  ) {
    super(ScheduleSettingModel, scheduleSettingMapper, session);
  }

  async findByUserId(userId: string): Promise<SessionSettings | null> {
    const scheduleSetting = await ScheduleSettingModel.findOne({
      instructorId: userId,
    });

    return scheduleSetting
      ? this.scheduleSettingMapper.toDomain(scheduleSetting)
      : null;
  }
}
