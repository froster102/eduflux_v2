import { GetCourseCategoriesUseCase } from '@/application/use-cases/get-course-categories.use-case';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';

@injectable()
export class CourseRoutes {
  constructor(
    @inject(TYPES.GetCourseCategoriesUseCase)
    private readonly getCourseCategories: GetCourseCategoriesUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group.get('/course-categories', async () => {
        const categories = await this.getCourseCategories.execute();
        return { categories };
      }),
    );
  }
}
