import type { MongooseSubscribedCourseView } from '@infrastructure/adapter/persistence/mongoose/models/subscribed-course/MongooseSubscribedCourseView';
import { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';

export class MongooseSubscribedCourseViewMapper {
  static toDomain(
    mongooseDoc: MongooseSubscribedCourseView,
  ): SubscribedCourseView {
    return SubscribedCourseView.new({
      id: mongooseDoc._id,
      userId: mongooseDoc.userId,
      title: mongooseDoc.title,
      thumbnail: mongooseDoc.thumbnail,
      description: mongooseDoc.description,
      level: mongooseDoc.level,
      instructor: mongooseDoc.instructor,
      enrollmentCount: mongooseDoc.enrollmentCount,
      averageRating: mongooseDoc.averageRating,
      createdAt: mongooseDoc.createdAt.toISOString(),
      updatedAt: mongooseDoc.updatedAt.toISOString(),
    });
  }

  static toPersistence(
    domainEntity: SubscribedCourseView,
  ): Partial<MongooseSubscribedCourseView> {
    return {
      _id: domainEntity.getId(),
      userId: domainEntity.userId,
      title: domainEntity.title,
      thumbnail: domainEntity.thumbnail,
      description: domainEntity.description,
      level: domainEntity.level,
      instructor: domainEntity.instructor,
      enrollmentCount: domainEntity.enrollmentCount,
      averageRating: domainEntity.averageRating,
      createdAt: new Date(domainEntity.createdAt),
      updatedAt: new Date(domainEntity.updatedAt),
    };
  }

  static toDomainEntities(
    docs: MongooseSubscribedCourseView[],
  ): SubscribedCourseView[] {
    return docs.map((doc) => this.toDomain(doc));
  }
}
