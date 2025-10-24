import { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import type { MongooseSessionSettings } from '@infrastructure/adapter/persistence/mongoose/model/session-settings/MongooseSessionSettings';

export class MongooseSessionSettingsMapper {
  static toDomain(raw: MongooseSessionSettings): SessionSettings {
    return SessionSettings.new({
      id: raw._id,
      instructorId: raw.instructorId,
      price: raw.price,
      currency: raw.currency,
      duration: raw.duration,
      isSessionEnabled: raw.isSessionEnabled,
      weeklySchedules: raw.weeklySchedules,
      applyForWeeks: raw.applyForWeeks,
      timeZone: raw.timeZone,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(raw: SessionSettings): Partial<MongooseSessionSettings> {
    return {
      _id: raw.id,
      instructorId: raw.instructorId,
      price: raw.price,
      currency: raw.currency,
      duration: raw.duration,
      weeklySchedules: raw.weeklySchedules,
      applyForWeeks: raw.applyForWeeks,
      timeZone: raw.timeZone,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainEntities(raw: MongooseSessionSettings[]): SessionSettings[] {
    return raw.map((r) => this.toDomain(r));
  }
}
