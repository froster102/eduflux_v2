import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';
import {
  GetAllInstructorCoursesInput,
  GetAllInstructorCoursesOutput,
} from '@/application/use-cases/get-all-instructor-course.use-case';
import {
  GetUserSubscribedCoursesInput,
  GetUserSubscribedCoursesOutput,
} from '@/application/use-cases/get-user-subscribed-courses';
import {
  GetSubscriberLectureInput,
  GetSubscriberLectureOutput,
} from '@/application/use-cases/get-subscriber-lecture.use-case';

@injectable()
export class CourseRoutes {
  constructor(
    @inject(TYPES.GetAllInstructorCoursesUseCase)
    private readonly getAllInstructorCoursesUseCase: IUseCase<
      GetAllInstructorCoursesInput,
      GetAllInstructorCoursesOutput
    >,
    @inject(TYPES.GetUserSubscribedCoursesUseCase)
    private readonly getUserSubscribedCoursesUseCase: IUseCase<
      GetUserSubscribedCoursesInput,
      GetUserSubscribedCoursesOutput
    >,
    @inject(TYPES.GetSubscriberLectureUseCase)
    private readonly getSubscriberLectureUseCase: IUseCase<
      GetSubscriberLectureInput,
      GetSubscriberLectureOutput
    >,
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
        })
        .get('/me/subscribed-courses', async ({ user, query }) => {
          const parsedQuery = paginationQuerySchema.parse(query);
          const response = await this.getUserSubscribedCoursesUseCase.execute({
            userId: user.id,
            paginationQueryParams: parsedQuery,
          });
          return response;
        })
        .get(
          '/me/subscribed-courses/:courseId/lectures/:lectureId',
          async ({ params, user }) => {
            const { lecture } = await this.getSubscriberLectureUseCase.execute({
              courseId: params.courseId,
              lectureId: params.lectureId,
              userId: user.id,
            });
            return { ...lecture };
          },
        ),
    );
  }
}
