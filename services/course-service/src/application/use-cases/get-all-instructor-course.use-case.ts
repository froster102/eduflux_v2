import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  GetAllInstructorCoursesInput,
  IGetAllInstructorCoursesUseCase,
} from './interface/get-all-instructor-course.interface';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';

export class GetAllInstructorCoursesUseCase
  implements IGetAllInstructorCoursesUseCase
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    getAllInstructorCoursesInput: GetAllInstructorCoursesInput,
  ): Promise<{ courses: Course[]; total: number }> {
    const { actorId, paginationQueryParams } = getAllInstructorCoursesInput;
    const { courses, total } =
      await this.courseRepository.findAllInstructorCourses(
        actorId,
        paginationQueryParams,
      );

    return { courses, total };
  }
}
