import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';
import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Course } from '@core/domain/course/entity/Course';

export interface CourseRepositoryPort extends BaseRepositoryPort<Course> {
  findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null>;
  findCourseByTitle(title: string): Promise<Course | null>;
  findAllInstructorCourses(
    instructorId: string,
    query?: CourseQueryParameters,
  ): Promise<CourseQueryResult>;
  findAllPublishedCourses(
    query?: CourseQueryParameters,
  ): Promise<CourseQueryResult>;
  incrementCourseEnrollmentCount(courseId: string): Promise<void>;
  findBySlug(slug: string): Promise<Course | null>;
  existsBySlug(slug: string): Promise<boolean>;
}
