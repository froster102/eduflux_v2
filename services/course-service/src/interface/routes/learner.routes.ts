import { GetPublishedCourseCurriculumUseCase } from '@/application/use-cases/get-published-course-curriculum';
import { GetPublishedCoursesUseCase } from '@/application/use-cases/get-published-courses.use-case';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';

@injectable()
export class LearnerRoutes {
  constructor(
    @inject(TYPES.GetPublishedCoursesUseCase)
    private readonly getPublishedCourses: GetPublishedCoursesUseCase,

    @inject(TYPES.GetPublishedCourseCurriculumUseCase)
    private readonly getPublishedCourseCurriculumUseCase: GetPublishedCourseCurriculumUseCase,
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
