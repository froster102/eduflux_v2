import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  GetPublishedCoursesInput,
  IGetPublishedCoursesUseCase,
} from './interface/get-published-courses.interface';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';

export class GetPublishedCoursesUseCase implements IGetPublishedCoursesUseCase {
  constructor(
    @inject(TYPES.CourseRepository) private courseRepository: ICourseRepository,
  ) {}

  async execute(
    getPublishedCoursesInput: GetPublishedCoursesInput,
  ): Promise<{ courses: Course[]; total: number }> {
    const { paginationQueryParams } = getPublishedCoursesInput;
    const result = await this.courseRepository.findAllPublishedCourses(
      paginationQueryParams,
    );
    return result;
  }
}
