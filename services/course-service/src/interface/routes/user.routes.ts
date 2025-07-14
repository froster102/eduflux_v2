import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';
import { GetAllInstructorCoursesUseCase } from '@/application/use-cases/get-all-instructor-course.use-case';

@injectable()
export class CourseRoutes {
  constructor(
    @inject(TYPES.GetAllInstructorCoursesUseCase)
    private readonly getAllInstructorCoursesUseCase: GetAllInstructorCoursesUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/users', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/me/taught-courses', async ({ user, query }) => {
          const paredQuery = paginationQuerySchema.parse(query);
          const response = await this.getAllInstructorCoursesUseCase.execute({
            actorId: user.id,
            paginationQueryParams: paredQuery,
          });
          return response;
        }),
    );
  }
}
