import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CheckUserEnrollmentUseCase } from '@core/application/enrollment/usecase/CheckUserEnrollmentUseCase';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import { authenticaionMiddleware } from '@api/http-rest/middlewares/authenticationMiddleware';
import Elysia, { t } from 'elysia';
import { inject } from 'inversify';
import { createEnrollmentSchema } from '@api/http-rest/schema/enrollment';

export class EnrollmentController {
  constructor(
    @inject(EnrollmentDITokens.CreateEnrollmentUseCase)
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
    @inject(EnrollmentDITokens.CheckUserEnrollmentUseCase)
    private readonly checkUserEnrollmentUseCase: CheckUserEnrollmentUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/enrollments', (group) =>
      group
        .use(authenticaionMiddleware)
        .post('/', async ({ body, user }) => {
          const parsedBody = createEnrollmentSchema.parse(body);
          const { checkoutUrl } = await this.createEnrollmentUseCase.execute({
            userId: user.id,
            courseId: parsedBody.courseId,
          });
          return { checkoutUrl };
        })
        .get(
          '/check-enrollment',
          async ({ user, query }) => {
            const status = await this.checkUserEnrollmentUseCase.execute({
              userId: user.id,
              courseId: query.courseId,
            });
            return status;
          },
          {
            query: t.Object({
              courseId: t.String(),
            }),
          },
        ),
    );
  }
}
