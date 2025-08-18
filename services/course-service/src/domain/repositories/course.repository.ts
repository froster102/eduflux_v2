import type { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Course } from '../entity/course.entity';
import type { IBaseRepository } from './base.repository';

export interface ICourseRepository extends IBaseRepository<Course> {
  findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null>;
  findCourseByTitle(title: string): Promise<Course | null>;
  findAllInstructorCourses(
    instructorId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ courses: Course[]; total: number }>;
  findAllPublishedCourses(
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ courses: Course[]; total: number }>;
  incrementCourseEnrollmentCount(courseId: string): Promise<void>;
}
