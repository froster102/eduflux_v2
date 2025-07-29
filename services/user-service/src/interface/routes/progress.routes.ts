import type { IDeleteLectureProgressUseCase } from '@/application/use-cases/interface/delete-lecture-progress.interface';
import type { IAddLectureProgressUseCase } from '@/application/use-cases/interface/add-lecture-progress.interface';
import type { IGetUserCourseProgressUseCase } from '@/application/use-cases/interface/get-user-course-progress.interface';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { Elysia, t } from 'elysia';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';

export class ProgressRoutes {
  constructor(
    @inject(TYPES.GetUserCourseProgressUseCase)
    private readonly getUserCourseProgressUseCase: IGetUserCourseProgressUseCase,
    @inject(TYPES.AddLectureProgressUseCase)
    private readonly addLectureProgressUseCase: IAddLectureProgressUseCase,
    @inject(TYPES.DeleteLectureProgressUseCase)
    private readonly deleteLectureProgressUseCase: IDeleteLectureProgressUseCase,
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
