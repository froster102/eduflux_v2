import { Course } from '@/domain/entity/course.entity';
import { MongoBaseRepository } from './base.repository';
import type { ICourse } from '../schema/course.schema';
import CourseModel from '../models/course.model';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import type { PaginationQueryParams } from '@/application/dto/pagination.dto';

@injectable()
export class MongoCourseRepository
  extends MongoBaseRepository<Course, ICourse>
  implements ICourseRepository
{
  constructor(
    @inject(TYPES.CourseMapper)
    private readonly courseMapper: IMapper<Course, ICourse>,
  ) {
    super(CourseModel, courseMapper);
  }

  async findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null> {
    const course = await CourseModel.findOne({
      _id: courseId,
      'instructor.id': instructorId,
    });
    return course ? this.courseMapper.toDomain(course) : null;
  }

  async findCourseByTitle(title: string): Promise<Course | null> {
    const course = await CourseModel.findOne({
      title,
    });

    return course ? this.courseMapper.toDomain(course) : null;
  }

  async findAllInstructorCourses(
    instructorId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ courses: Course[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'asc',
    } = paginationQueryParams;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    query['instructor.id'] = instructorId;

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = limit;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const total = await CourseModel.countDocuments(query);

    const result = await CourseModel.find(query, null, options);

    return result
      ? {
          courses: this.courseMapper.toDomainArray(result),
          total,
        }
      : { courses: [], total };
  }

  async findAllPublishedCourses(
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ courses: Course[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'asc',
    } = paginationQueryParams;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    query['status'] = 'published';

    const allowedFilters = ['category', 'level', 'language'];

    if (filters) {
      for (const key in filters) {
        if (
          Object.prototype.hasOwnProperty.call(filters, key) &&
          allowedFilters.includes(key)
        ) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = limit;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const total = await CourseModel.countDocuments(query);
    const result = await CourseModel.find(query, null, options);

    return result
      ? {
          courses: this.courseMapper.toDomainArray(result),
          total,
        }
      : { courses: [], total: 0 };
  }

  async incrementCourseEnrollmentCount(courseId: string): Promise<void> {
    await CourseModel.findOneAndUpdate(
      { _id: courseId },
      { $inc: { enrollmentCount: 1 } },
    );
  }
}
