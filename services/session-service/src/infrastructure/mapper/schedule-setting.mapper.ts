import { ScheduleSetting } from '@/domain/entities/schedule-setting.entity';
import { IMapper } from './mapper.interface';
import { IMongoScheduleSetting } from '../database/schema/schedule-setting.schema';

export class ScheduleSettingMapper
  implements IMapper<ScheduleSetting, IMongoScheduleSetting>
{
  toDomain(raw: IMongoScheduleSetting): ScheduleSetting {
    return ScheduleSetting.fromPersistence(
      raw._id,
      raw.instructorId,
      raw.weeklyAvailabilityTemplate,
      raw.slotDurationMinutes,
      raw.applyForWeeks,
      raw.timeZone,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toPersistence(setting: ScheduleSetting): IMongoScheduleSetting {
    return {
      _id: setting.id,
      instructorId: setting.instructorId,
      weeklyAvailabilityTemplate: setting.weeklyAvailabilityTemplate,
      slotDurationMinutes: setting.slotDurationMinutes,
      applyForWeeks: setting.applyForWeeks,
      timeZone: setting.timeZone,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    } as IMongoScheduleSetting;
  }

  toDomainArray(raw: IMongoScheduleSetting[]): ScheduleSetting[] {
    return raw.map((r) => this.toDomain(r));
  }
}
