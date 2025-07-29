import type { ICheckUserEnrollmentUseCase } from '@/application/use-cases/interface/check-user-enrollment.inerface';
import type { ICreateEnrollmentUseCase } from '@/application/use-cases/interface/create-enrollment.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia, t } from 'elysia';
import { createEnrollmentSchema } from '@/infrastructure/http/schema/enrollment.schema';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';

@injectable()
export class EnrollmentRoutes {
  constructor(
    @inject(TYPES.CreateEnrollmentUseCase)
    private readonly createEnrollmentUseCase: ICreateEnrollmentUseCase,
    @inject(TYPES.CheckUserEnrollmentUseCase)
    private readonly checkUserEnrollmentUseCase: ICheckUserEnrollmentUseCase,
  ) {}

  setupRoutes(): Elysia {
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
