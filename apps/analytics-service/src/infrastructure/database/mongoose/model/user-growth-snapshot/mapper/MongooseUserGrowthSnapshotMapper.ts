import { UserGrowthSnapshot } from '@analytics/entities/UserGrowthSnapshot';
import type { MongooseUserGrowthSnapshot } from '@infrastructure/database/mongoose/model/MongooseUserGrowthSnapshot';

export class MongooseUserGrowthSnapshotMapper {
  toDomain(document: MongooseUserGrowthSnapshot): UserGrowthSnapshot {
    return new UserGrowthSnapshot({
      date: document.date,
      userCount: document.userCount,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  toDomainEntities(
    documents: MongooseUserGrowthSnapshot[],
  ): UserGrowthSnapshot[] {
    return documents.map((doc) => this.toDomain(doc));
  }

  toPersistence(
    entity: UserGrowthSnapshot,
  ): Partial<MongooseUserGrowthSnapshot> {
    return {
      date: entity.date,
      userCount: entity.userCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

