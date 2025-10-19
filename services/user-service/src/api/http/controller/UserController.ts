import { authenticaionMiddleware } from 'src/api/http/middleware/authenticationMiddleware';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';
import httpStatus from 'http-status';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { GetLearnerStatsUseCase } from '@core/application/learner-stats/usecase/GetLearnerStatsUseCase';
import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { GetInstructorViewsUseCase } from '@core/application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewUseCase } from '@core/application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { SubscribedCourseViewDITokens } from '@core/application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { GetSubscribedCourseViewsUseCase } from '@core/application/views/subscribed-course/usecase/GetSubscribedCourseViewsUseCase';
import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { GetTaughtCourseViewsUseCase } from '@core/application/views/taught-course/usecase/GetTaughtCourseViewsUseCase';
import { getTaughtCourseSchema } from '@api/http/validators/getTaughtCoursesSchema';
import { updateUserSchema } from '@api/http/validators/user';
import { paginationSchema } from '@api/http/validators/paginationSchema';
import { getSubscribedCoursesSchema } from '@api/http/validators/getSubscribedCoursesSchema';

export class UserController {
  constructor(
    @inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(UserDITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(LearnerStatsDITokens.GetLearnerStatsUseCase)
    private readonly getLearnerStatsUseCase: GetLearnerStatsUseCase,
    @inject(InstructorViewDITokens.GetInstructorViewsUseCase)
    private readonly getInstructorViewsUseCase: GetInstructorViewsUseCase,
    @inject(InstructorViewDITokens.GetInstructorViewUseCase)
    private readonly getInstructorViewUseCase: GetInstructorViewUseCase,
    @inject(SubscribedCourseViewDITokens.GetSubscribedCourseViewsUseCase)
    private readonly getSubscribedCourseViewsUseCase: GetSubscribedCourseViewsUseCase,
    @inject(TaughtCourseViewDITokens.GetTaughtCourseViewUseCase)
    private readonly getTaughtCourseViewUseCase: GetTaughtCourseViewsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/users', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/me', async ({ user, set }) => {
          const foundUser = await this.getUserUseCase.execute({
            userId: user.id,
          });
          set.status = httpStatus.OK;
          return JSON.stringify(foundUser);
        })
        .put('/me', async ({ body, user }) => {
          const { firstName, lastName, bio, image, socialLinks } =
            updateUserSchema.parse(body);
          const updatedUser = await this.updateUserUseCase.execute({
            id: user.id,
            firstName,
            lastName,
            bio,
            image,
            socialLinks,
          });
          return updatedUser;
        })
        .get('/learners/me', async ({ user }) => {
          const response = await this.getLearnerStatsUseCase.execute({
            learnerId: user.id,
          });
          return JSON.stringify(response);
        })
        .get('/instructors', async ({ query, user }) => {
          const parsedQuery = paginationSchema.parse(query);
          const { totalCount, instructors } =
            await this.getInstructorViewsUseCase.execute({
              executorId: user.id,
              queryParameters: {
                limit: parsedQuery.limit,
                offset: (parsedQuery.page - 1) * parsedQuery.limit,
              },
            });
          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedQuery.limit),
              currentPage: parsedQuery.page,
            },
            instructors,
          };
        })
        .get('/instructors/:id', async ({ params }) => {
          const instructor = await this.getInstructorViewUseCase.execute({
            instructorId: params.id,
          });

          return JSON.stringify(instructor);
        })
        .get('/me/subscribed-courses', async ({ user, query }) => {
          const parsedQuery = getSubscribedCoursesSchema.parse(query);
          const { totalCount, courses } =
            await this.getSubscribedCourseViewsUseCase.execute({
              userId: user.id,
              query: {
                limit: parsedQuery.limit,
                offset: (parsedQuery.page - 1) * parsedQuery.limit,
              },
            });
          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedQuery.limit),
              currentPage: parsedQuery.page,
            },
            courses,
          };
        })
        .get('/me/taught-courses', async ({ user, query }) => {
          const parsedQuery = getTaughtCourseSchema.parse(query);
          const { totalCount, courses } =
            await this.getTaughtCourseViewUseCase.execute({
              userId: user.id,
              query: {
                limit: parsedQuery.limit,
                offset: (parsedQuery.page - 1) * parsedQuery.limit,
              },
            });
          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedQuery.limit),
              currentPage: parsedQuery.page,
            },
            courses,
          };
        }),
    );
  }
}
