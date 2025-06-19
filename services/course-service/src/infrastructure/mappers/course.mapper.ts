import { Course } from '@/domain/entity/course.entity';
import type { IMapper } from './mapper.interface';
import { ICourse } from '../database/schema/course.schema';

export class CourseMapper implements IMapper<Course, ICourse> {
  toDomain(raw: ICourse): Course {
    return Course.fromPersistence(
      (raw._id as string).toString(),
      raw.title,
      raw.description,
      raw.thumbnail,
      raw.level,
      raw.price,
      raw.isFree,
      raw.status,
      raw.feedback,
      raw.instructor,
      raw.averageRating,
      raw.ratingCount,
      raw.createdAt,
      raw.publishedAt,
      raw.updatedAt,
    );
  }

  toPersistence(raw: Course): Partial<ICourse> {
    return {
      _id: raw.id,
      title: raw.title,
      description: raw.description,
      level: raw.level,
      price: raw.priceTierId,
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
