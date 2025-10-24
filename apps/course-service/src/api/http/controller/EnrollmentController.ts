import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import { createEnrollmentSchema } from '@api/http/validators/createEnrollmentSchema';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import { jsonApiResponse } from '@shared/utils/jsonApi';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class EnrollmentController {
  constructor(
    @inject(EnrollmentDITokens.CreateEnrollmentUseCase)
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/enrollments', (group) =>
      group.use(authenticaionMiddleware).post('/', async ({ body, user }) => {
        const parsedBody = createEnrollmentSchema.parse(body);
        const response = await this.createEnrollmentUseCase.execute({
          userId: user.id,
          courseId: parsedBody.courseId,
        });
        return jsonApiResponse({ data: response });
      }),
    );
  }
}
