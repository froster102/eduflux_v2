import { Chapter } from '@core/domain/chapter/entity/Chapter';
import type { Mapper } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/mapper/MongooseBaseMapper';
import type { MongooseChapter } from '@infrastructure/adapter/persistence/mongoose/model/chapter/MongooseChapter';

export class MongooseChapterMapper implements Mapper<Chapter, MongooseChapter> {
  toDomain(doc: MongooseChapter): Chapter {
    return Chapter.new({
      id: doc._id,
      courseId: doc.courseId,
      title: doc.title,
      description: doc.description,
      sortOrder: doc.sortOrder,
      objectIndex: doc.objectIndex,
    });
  }

  toDomainEntities(docs: MongooseChapter[]): Chapter[] {
    return docs.map((doc) => this.toDomain(doc));
  }

  toPersistence(domain: Chapter): Partial<MongooseChapter> {
    return {
      _id: domain.id,
      courseId: domain.courseId,
      title: domain.title,
      description: domain.description,
      sortOrder: domain.sortOrder,
      objectIndex: domain.objectIndex,
    };
  }
}
