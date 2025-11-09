import { TaughtCourseView } from '@application/views/taught-course/entity/TaughtCourseView';
import type { MongooseTaughtCourseView } from '@infrastructure/adapter/persistence/mongoose/models/taught-course/MongooseTaughtCourseView';

export class MongooseTaughtCourseViewMapper {
  static toDomain(mongooseDoc: MongooseTaughtCourseView): TaughtCourseView {
    return TaughtCourseView.new({
      id: mongooseDoc._id,
      instructorId: mongooseDoc.instructorId,
      title: mongooseDoc.title,
      thumbnail: mongooseDoc.thumbnail,
      level: mongooseDoc.level,
      enrollmentCount: mongooseDoc.enrollmentCount,
      averageRating: mongooseDoc.averageRating,
      createdAt: mongooseDoc.createdAt.toISOString(),
      updatedAt: mongooseDoc.updatedAt.toISOString(),
    });
  }

  static toPersistence(
    domainEntity: TaughtCourseView,
  ): Partial<MongooseTaughtCourseView> {
    return {
      _id: domainEntity.id,
      instructorId: domainEntity.instructorId,
      title: domainEntity.title,
      thumbnail: domainEntity.thumbnail,
      level: domainEntity.level,
      enrollmentCount: domainEntity.enrollmentCount,
      averageRating: domainEntity.averageRating,
      createdAt: new Date(domainEntity.createdAt),
      updatedAt: new Date(domainEntity.updatedAt),
    };
  }

  static toDomainEntities(
    docs: MongooseTaughtCourseView[],
  ): TaughtCourseView[] {
    return docs.map((d) => this.toDomain(d));
  }
}
