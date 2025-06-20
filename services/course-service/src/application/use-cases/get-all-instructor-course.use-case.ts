import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { PaginationQueryParams } from '../dto/pagination.dto';

export class GetAllInstructorCoursesUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    actorId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<Course[]> {
    const courses = await this.courseRepository.findAllInstructorCourses(
      actorId,
      paginationQueryParams,
    );

    return courses;
  }
}
