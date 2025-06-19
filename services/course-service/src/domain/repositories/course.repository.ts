import { Course } from '../entity/course.entity';
import { IBaseRepository } from './base.repository';

export interface ICourseRepository extends IBaseRepository<Course> {
  findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null>;
  findCourseByTitle(title: string): Promise<Course | null>;
}
