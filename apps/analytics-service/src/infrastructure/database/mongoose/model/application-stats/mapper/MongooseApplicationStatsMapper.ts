import { ApplicationStats } from '@analytics/entities/ApplicationStats';
import type { MongooseApplicationStats } from '@infrastructure/database/mongoose/model/MongooseApplicationStats';

export class MongooseApplicationStatsMapper {
  toDomain(document: MongooseApplicationStats): ApplicationStats {
    return new ApplicationStats({
      id: document._id,
      totalLearners: document.totalLearners,
      totalInstructors: document.totalInstructors,
      totalCourses: document.totalCourses,
      platformEarnings: document.platformEarnings,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  toDomainEntities(documents: MongooseApplicationStats[]): ApplicationStats[] {
    return documents.map((doc) => this.toDomain(doc));
  }

  toPersistence(entity: ApplicationStats): Partial<MongooseApplicationStats> {
    return {
      _id: entity.id,
      totalLearners: entity.totalLearners,
      totalInstructors: entity.totalInstructors,
      totalCourses: entity.totalCourses,
      platformEarnings: entity.platformEarnings,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
