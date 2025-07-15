import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia, t } from 'elysia';
import {
  CreateEnrollmentDto,
  CreateEnrollmentOutputDto,
} from '@/application/use-cases/create-enrollment.use-case';
import { createEnrollmentSchema } from '@/infrastructure/http/schema/enrollment.schema';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import {
  CheckEnrollmentOutputDto,
  CheckUserEnrollmentDto,
} from '@/application/use-cases/check-user-enrollment.use-case';

@injectable()
export class EnrollmentRoutes {
  constructor(
    @inject(TYPES.CreateEnrollmentUseCase)
    private readonly createEnrollmentUseCase: IUseCase<
      CreateEnrollmentDto,
      CreateEnrollmentOutputDto
    >,
    @inject(TYPES.CheckUserEnrollmentUseCase)
    private readonly checkUserEnrollmentUseCase: IUseCase<
      CheckUserEnrollmentDto,
      CheckEnrollmentOutputDto
    >,
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
