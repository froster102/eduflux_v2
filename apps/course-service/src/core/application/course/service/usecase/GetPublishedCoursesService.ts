import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { GetPublishedCoursesPort } from '@core/application/course/port/usecase/GetPublishedCoursesPort';
import type { GetPublishedCoursesUseCase } from '@core/application/course/usecase/GetPublishedCoursesUseCase';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { inject } from 'inversify';

export class GetPublishedCoursesService implements GetPublishedCoursesUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: GetPublishedCoursesPort): Promise<CourseQueryResult> {
    const { query } = payload;

    if (query?.filters?.status) {
      if (query.filters.status !== CourseStatus.PUBLISHED) {
        throw new InvalidInputException('Invalid input');
      }
    }

    const result = await this.courseRepository.findAllPublishedCourses(query);

    return result;
  }
}
