import { Course } from '@/domain/entity/course.entity';
import type { IMapper } from './mapper.interface';
import { ICourse } from '../database/schema/course.schema';

export class CourseMapper implements IMapper<Course, ICourse> {
  toDomain(raw: ICourse): Course {
    return Course.fromPersistence({
      id: (raw._id as string).toString(),
      title: raw.title,
      description: raw.description,
      thumbnail: raw.thumbnail,
      level: raw.level,
      price: raw.price,
      categoryId: raw.categoryId,
      isFree: raw.isFree,
      status: raw.status,
      feedback: raw.feedback,
      instructor: raw.instructor,
      averageRating: raw.averageRating,
      ratingCount: raw.ratingCount,
      createdAt: raw.createdAt,
      publishedAt: raw.publishedAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(raw: Course): Partial<ICourse> {
    return {
      _id: raw.id,
      title: raw.title,
      description: raw.description,
      level: raw.level,
      price: raw.price,
      categoryId: raw.categoryId,
      isFree: raw.isFree,
      status: raw.status,
      feedback: raw.feedback,
      averageRating: raw.averageRating,
      ratingCount: raw.ratingCount,
      publishedAt: raw.publishedAt,
      instructor: raw.instructor,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  toDomainArray(raw: ICourse[]): Course[] {
    return raw.map((r) => this.toDomain(r));
  }
}
