import type { IGetPublishedCoursesUseCase } from '@/application/use-cases/interface/get-published-courses.interface';
import type { IGetPublishedCourseCurriculumUseCase } from '@/application/use-cases/interface/get-published-course-curriculum.interface';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';

@injectable()
export class LearnerRoutes {
  constructor(
    @inject(TYPES.GetPublishedCoursesUseCase)
    private readonly getPublishedCourses: IGetPublishedCoursesUseCase,

    @inject(TYPES.GetPublishedCourseCurriculumUseCase)
    private readonly getPublishedCourseCurriculumUseCase: IGetPublishedCourseCurriculumUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group
        .get('/:courseId/subscriber-curriculum-items/', () => {})
        .get('/', async ({ query }) => {
          const paredQuery = paginationQuerySchema.parse(query);
          const result = await this.getPublishedCourses.execute({
            paginationQueryParams: paredQuery,
          });

          return result;
        })
        .get('/:courseId/curriculum', async ({ params }) => {
          const curriculum =
            await this.getPublishedCourseCurriculumUseCase.execute(
              params.courseId,
            );
          return curriculum;
        }),
    );
  }
}
