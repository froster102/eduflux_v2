import { Progress } from '@core/domain/progress/entity/Progress';
import type { IMongooseProgress } from '@infrastructure/adapter/persistence/mongoose/models/progress/MongooseProgress';

export class MongooseProgressMapper {
  static toDomain(mongooseProgress: IMongooseProgress): Progress {
    const domainProgress: Progress = new Progress({
      id: mongooseProgress._id,
      userId: mongooseProgress.userId,
      courseId: mongooseProgress.courseId,
      completedLectures: new Set(mongooseProgress.completedLectures),
    });
    return domainProgress;
  }

  static toPersistence(domainProgress: Progress): Partial<IMongooseProgress> {
    return {
      _id: domainProgress.getId(),
      userId: domainProgress.getUserId(),
      courseId: domainProgress.getCourseId(),
      completedLectures: domainProgress.getCompletedLectures(),
    };
  }

  static toDomainEntities(raw: IMongooseProgress[]): Progress[] {
    return raw.map((r) => this.toDomain(r));
  }
}
