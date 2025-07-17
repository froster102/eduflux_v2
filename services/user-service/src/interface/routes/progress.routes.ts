import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { Elysia, t } from 'elysia';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { AddLectureProgressInput } from '@/application/use-cases/add-lecture-progress.use-case';
import { DeleteLectureProgressInput } from '@/application/use-cases/delete-lecture-progress.use-case';
import { IRoute } from './interface/routes.interface';
import {
  GetUserCourseProgessInput,
  GetUserCourseProgressOutput,
} from '@/application/use-cases/get-user-course-progress.use-case';

export class ProgressRoutes implements IRoute<Elysia> {
  constructor(
    @inject(TYPES.GetUserCourseProgressUseCase)
    private readonly getUserCourseProgressUseCase: IUseCase<
      GetUserCourseProgessInput,
      GetUserCourseProgressOutput
    >,
    @inject(TYPES.AddLectureProgressUseCase)
    private readonly addLectureProgressUseCase: IUseCase<
      AddLectureProgressInput,
      void
    >,
    @inject(TYPES.DeleteLectureProgressUseCase)
    private readonly deleteLectureProgressUseCase: IUseCase<
      DeleteLectureProgressInput,
      void
    >,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/users/me/subscribed-courses', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/:courseId/progress', async ({ user, params }) => {
          const response = await this.getUserCourseProgressUseCase.execute({
            courseId: params.courseId,
            userId: user.id,
          });
          return response;
        })
        .post(
          '/:courseId/completed-lectures',
          async ({ body, user, params }) => {
            await this.addLectureProgressUseCase.execute({
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
            await this.deleteLectureProgressUseCase.execute({
              courseId: params.courseId,
              lectureId: params.lectureId,
              userId: user.id,
            });
          },
        ),
    );
  }
}
