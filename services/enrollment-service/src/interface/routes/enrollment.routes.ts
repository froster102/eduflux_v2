import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { CreateEnrollmentUseCase } from '@/application/use-cases/create-enrollment.use-case';
import { createEnrollmentSchema } from '@/infrastructure/http/schema/enrollment.schema';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';

@injectable()
export class EnrollmentRoutes {
  constructor(
    @inject(TYPES.CreateEnrollmentUseCase)
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
  ) {}

  setupRoutes(): Elysia {
    return new Elysia().group('/api/enrollments', (group) =>
      group.use(authenticaionMiddleware).post('/', async ({ body, user }) => {
        const parsedBody = createEnrollmentSchema.parse(body);
        const { checkoutUrl } = await this.createEnrollmentUseCase.execute({
          userId: user.id,
          courseId: parsedBody.courseId,
        });
        return { checkoutUrl };
      }),
    );
  }
}
