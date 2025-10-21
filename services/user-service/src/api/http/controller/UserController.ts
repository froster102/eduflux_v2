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
import { jsonApiResponse, parseJsonApiQuery } from '@shared/utils/jsonApi';
import { calculateOffset } from '@shared/utils/helper';
import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import type { GetInstructorUseCase } from '@core/application/instructor/usecase/GetInstructorUseCase';

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
    @inject(InstructorDITokens.GetInstructorUseCase)
    private readonly getInstructorUseCase: GetInstructorUseCase,
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
          return jsonApiResponse({ data: foundUser });
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
          return jsonApiResponse({ data: updatedUser });
        })
        .get('/learners/me', async ({ user }) => {
          const response = await this.getLearnerStatsUseCase.execute({
            learnerId: user.id,
          });
          return jsonApiResponse({ data: response });
        })
        .get('/instructors', async ({ query, user }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = paginationSchema.parse(jsonApiQuery);
          const { totalCount, instructors } =
            await this.getInstructorViewsUseCase.execute({
              executorId: user.id,
              queryParameters: {
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });
          return jsonApiResponse({
            data: instructors,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
            totalCount,
          });
        })
        .get('/instructors/me/stats', async ({ user }) => {
          const instructor = await this.getInstructorUseCase.execute({
            instructorId: user.id,
          });
          return jsonApiResponse({ data: instructor });
        })
        .get('/instructors/:id', async ({ params }) => {
          const instructor = await this.getInstructorViewUseCase.execute({
            instructorId: params.id,
          });

          return jsonApiResponse({ data: instructor });
        })
        .get('/me/subscribed-courses', async ({ user, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getSubscribedCoursesSchema.parse(jsonApiQuery);
          const { totalCount, courses } =
            await this.getSubscribedCourseViewsUseCase.execute({
              userId: user.id,
              query: {
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });
          return jsonApiResponse({
            data: courses,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
            totalCount,
          });
        })
        .get('/me/taught-courses', async ({ user, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getTaughtCourseSchema.parse(jsonApiQuery);
          const { totalCount, courses } =
            await this.getTaughtCourseViewUseCase.execute({
              userId: user.id,
              query: {
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });
          return jsonApiResponse({
            data: courses,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
            totalCount,
          });
        }),
    );
  }
}
