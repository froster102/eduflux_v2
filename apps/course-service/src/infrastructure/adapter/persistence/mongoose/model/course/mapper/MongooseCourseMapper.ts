import { Course } from '@core/domain/course/entity/Course';
import type { CourseLevel } from '@core/domain/course/enum/CourseLevel';
import type { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import type { Mapper } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/mapper/MongooseBaseMapper';
import type { MongooseCourse } from '@infrastructure/adapter/persistence/mongoose/model/course/MongooseCourse';

export class MongooseCourseMapper implements Mapper<Course, MongooseCourse> {
  toDomain(raw: MongooseCourse): Course {
    return Course.new({
      id: raw._id,
      title: raw.title,
      description: raw.description,
      thumbnail: raw.thumbnail,
      level: raw.level as CourseLevel | null,
      categoryId: raw.categoryId,
      price: raw.price,
      isFree: raw.isFree,
      status: raw.status as CourseStatus,
      feedback: raw.feedback,
      slug: raw.slug,
      instructor: {
        id: raw.instructor.id,
        name: raw.instructor.name,
      },
      averageRating: raw.averageRating,
      ratingCount: raw.ratingCount,
      enrollmentCount: raw.enrollmentCount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      publishedAt: raw.publishedAt,
    });
  }
  toPersistence(raw: Course): Partial<MongooseCourse> {
    return {
      _id: raw.id,
      title: raw.title,
      description: raw.description,
      thumbnail: raw.thumbnail,
      level: raw.level,
      categoryId: raw.categoryId,
      price: raw.price,
      isFree: raw.isFree,
      slug: raw.slug,
      status: raw.status,
      feedback: raw.feedback,
      instructor: {
        id: raw.instructor.id,
        name: raw.instructor.name,
      },
      averageRating: raw.averageRating,
      ratingCount: raw.ratingCount,
      enrollmentCount: raw.enrollmentCount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      publishedAt: raw.publishedAt,
    };
  }
  toDomainEntities(raw: MongooseCourse[]): Course[] {
    return raw.map((raw) => this.toDomain(raw));
  }
}
