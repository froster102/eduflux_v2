import { Lecture } from '@core/domain/lecture/entity/Lecture';
import type { MongooseLecture } from '@infrastructure/adapter/persistence/mongoose/model/lecture/MongooseLecture';

export class MongooseLectureMapper {
  static toDomainEntity(doc: MongooseLecture): Lecture {
    return Lecture.new({
      id: doc._id,
      courseId: doc.courseId,
      title: doc.title,
      description: doc.description,
      assetId: doc.assetId,
      preview: doc.preview,
      sortOrder: doc.sortOrder,
      objectIndex: doc.objectIndex,
    });
  }

  static toDomainEntities(docs: MongooseLecture[]): Lecture[] {
    return docs.map((doc) => this.toDomainEntity(doc));
  }

  static toMongooseEntity(domain: Lecture): Partial<MongooseLecture> {
    return {
      _id: domain.id,
      courseId: domain.courseId,
      title: domain.title,
      description: domain.description,
      assetId: domain.assetId,
      preview: domain.preview,
      sortOrder: domain.sortOrder,
      objectIndex: domain.objectIndex,
    };
  }
}
