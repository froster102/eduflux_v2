import { authenticaionMiddleware } from '@api/http/middleware/authenticationMiddleware';
import { ProgressDITokens } from '@application/progress/di/ProgressDITokens';
import type { AddToProgressUseCase } from '@application/progress/usecase/AddToProgressUseCase';
import type { GetProgressUseCase } from '@application/progress/usecase/GetProgressUseCase';
import type { RemoveFromProgressUseCase } from '@application/progress/usecase/RemoveFromProgressUseCase';
import { jsonApiResponse } from '@eduflux-v2/shared/utils/jsonApi';
import Elysia, { t } from 'elysia';
import { inject } from 'inversify';

export class ProgressController {
  constructor(
    @inject(ProgressDITokens.GetProgressUseCase)
    private readonly getProgressUseCase: GetProgressUseCase,
    @inject(ProgressDITokens.AddToProgressUseCase)
    private readonly addToProgressUseCase: AddToProgressUseCase,
    @inject(ProgressDITokens.RemoveFromProgressUseCase)
    private readonly removeFromProgressUseCase: RemoveFromProgressUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/users/me/subscribed-courses', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/:courseId/progress', async ({ user, params }) => {
          const response = await this.getProgressUseCase.execute({
            courseId: params.courseId,
            userId: user.id,
          });
          return jsonApiResponse({ data: response });
        })
        .post(
          '/:courseId/completed-lectures',
          async ({ body, user, params }) => {
            await this.addToProgressUseCase.execute({
              userId: user.id,
              courseId: params.courseId,
              lectureId: body.lectureId,
            });
          },
          {
            body: t.Object({
              lectureId: t.String(),
            }),
          },
        )
        .delete(
          '/:courseId/completed-lectures/:lectureId',
          async ({ user, params }) => {
            await this.removeFromProgressUseCase.execute({
              courseId: params.courseId,
              lectureId: params.lectureId,
              userId: user.id,
            });
          },
        ),
    );
  }
}
