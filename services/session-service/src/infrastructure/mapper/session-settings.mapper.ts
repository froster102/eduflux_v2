import { SessionSettings } from '@/domain/entities/session-settings.entity';
import type { IMapper } from './mapper.interface';
import type { IMongoScheduleSetting } from '../database/schema/session-settings.schema';

export class ScheduleSettingMapper
  implements IMapper<SessionSettings, IMongoScheduleSetting>
{
  toDomain(raw: IMongoScheduleSetting): SessionSettings {
    return SessionSettings.fromPersistence(
      raw._id,
      raw.instructorId,
      raw.price,
      raw.currency,
      raw.duration,
      raw.isSessionEnabled,
      raw.weeklySchedules,
      raw.applyForWeeks,
      raw.timeZone,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toPersistence(settings: SessionSettings): IMongoScheduleSetting {
    return {
      _id: settings.id,
      instructorId: settings.instructorId,
      price: settings.price,
      currency: settings.currency,
      duration: settings.duration,
      weeklySchedules: settings.weeklySchedules,
      applyForWeeks: settings.applyForWeeks,
      timeZone: settings.timeZone,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    } as IMongoScheduleSetting;
  }

  toDomainArray(raw: IMongoScheduleSetting[]): SessionSettings[] {
    return raw.map((r) => this.toDomain(r));
  }
}
