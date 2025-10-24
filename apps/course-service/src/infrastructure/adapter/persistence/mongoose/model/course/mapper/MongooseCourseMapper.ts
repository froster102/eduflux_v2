import { Course } from '@core/domain/course/entity/Course';
import { CourseLevel } from '@core/domain/course/enum/CourseLevel';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import type { MongooseCourse } from '@infrastructure/adapter/persistence/mongoose/model/course/MongooseCourse';

export class MongooseCourseMapper {
  static toDomainEntity(doc: MongooseCourse): Course {
    return Course.new({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      thumbnail: doc.thumbnail,
      level: doc.level as CourseLevel | null,
      categoryId: doc.categoryId,
      price: doc.price,
      isFree: doc.isFree,
      status: doc.status as CourseStatus,
      feedback: doc.feedback,
      slug: doc.slug,
      instructor: {
        id: doc.instructor.id,
        name: doc.instructor.name,
      },
      averageRating: doc.averageRating,
      ratingCount: doc.ratingCount,
      enrollmentCount: doc.enrollmentCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
    });
  }

  static toDomainEntities(docs: MongooseCourse[]): Course[] {
    return docs.map((doc) => this.toDomainEntity(doc));
  }

  static toMongooseEntity(domain: Course): Partial<MongooseCourse> {
    return {
      _id: domain.id,
      title: domain.title,
      description: domain.description,
      thumbnail: domain.thumbnail,
      level: domain.level,
      categoryId: domain.categoryId,
      price: domain.price,
      isFree: domain.isFree,
      slug: domain.slug,
      status: domain.status,
      feedback: domain.feedback,
      instructor: {
        id: domain.instructor.id,
        name: domain.instructor.name,
      },
      averageRating: domain.averageRating,
      ratingCount: domain.ratingCount,
      enrollmentCount: domain.enrollmentCount,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      publishedAt: domain.publishedAt,
    };
  }
}
