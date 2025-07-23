import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type { IScheduleSettingRepository } from '@/domain/repositories/schedule-setting.repository';
import type { IMongoScheduleSetting } from '../schema/schedule-setting.schema';
import { MongoBaseRepository } from './base.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { ScheduleSetting } from '@/domain/entities/schedule-setting.entity';
import { ScheduleSettingModel } from '../models/schedule-setting.model';

export class MongoScheduleSettingRepository
  extends MongoBaseRepository<ScheduleSetting, IMongoScheduleSetting>
  implements IScheduleSettingRepository
{
  constructor(
    @inject(TYPES.ScheduleSettingMapper)
    private readonly scheduleSettingMapper: IMapper<
      ScheduleSetting,
      IMongoScheduleSetting
    >,
  ) {
    super(ScheduleSettingModel, scheduleSettingMapper);
  }

  async findByUserId(userId: string): Promise<ScheduleSetting | null> {
    const scheduleSetting = await ScheduleSettingModel.findOne({
      instructorId: userId,
    });

    return scheduleSetting
      ? this.scheduleSettingMapper.toDomain(scheduleSetting)
      : null;
  }
}
