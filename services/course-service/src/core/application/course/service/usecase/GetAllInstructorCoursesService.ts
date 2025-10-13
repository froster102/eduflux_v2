import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { GetAllInstructorCoursesPort } from '@core/application/course/port/usecase/GetAllInstructorCoursesPort';
import type { GetAllInstructorCoursesUseCase } from '@core/application/course/usecase/GetAllInstructorCoursesUseCase';
import { inject } from 'inversify';

export class GetAllInstructorCoursesService
  implements GetAllInstructorCoursesUseCase
{
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(
    payload: GetAllInstructorCoursesPort,
  ): Promise<CourseQueryResult> {
    const { actor, query } = payload;

    const result = await this.courseRepository.findAllInstructorCourses(
      actor.id,
      query,
    );

    return result;
  }
}
