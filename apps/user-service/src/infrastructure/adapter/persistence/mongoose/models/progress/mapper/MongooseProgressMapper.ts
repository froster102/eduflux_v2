import { Progress } from '@core/domain/progress/entity/Progress';
import type { MongooseProgress } from '@infrastructure/adapter/persistence/mongoose/models/progress/MongooseProgress';

export class MongooseProgressMapper {
  static toDomain(mongooseProgress: MongooseProgress): Progress {
    const domainProgress: Progress = new Progress({
      id: mongooseProgress._id,
      userId: mongooseProgress.userId,
      courseId: mongooseProgress.courseId,
      completedLectures: new Set(mongooseProgress.completedLectures),
    });
    return domainProgress;
  }

  static toPersistence(domainProgress: Progress): Partial<MongooseProgress> {
    return {
      _id: domainProgress.id,
      userId: domainProgress.getUserId(),
      courseId: domainProgress.getCourseId(),
      completedLectures: domainProgress.getCompletedLectures(),
    };
  }

  static toDomainEntities(raw: MongooseProgress[]): Progress[] {
    return raw.map((r) => this.toDomain(r));
  }
}
