import { UserDITokens } from '@application/user/di/UserDITokens';
import Elysia from 'elysia';
import { inject } from 'inversify';
import httpStatus from 'http-status';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { GetLearnerStatsUseCase } from '@application/learner-stats/usecase/GetLearnerStatsUseCase';
import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { GetInstructorViewsUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { GetSubscribedCourseViewsUseCase } from '@application/views/subscribed-course/usecase/GetSubscribedCourseViewsUseCase';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { GetTaughtCourseViewsUseCase } from '@application/views/taught-course/usecase/GetTaughtCourseViewsUseCase';
import { getTaughtCourseSchema } from '@api/http/validators/getTaughtCoursesSchema';
import { updateUserSchema } from '@api/http/validators/user';
import { paginationSchema } from '@api/http/validators/paginationSchema';
import { getSubscribedCoursesSchema } from '@api/http/validators/getSubscribedCoursesSchema';
import {
  jsonApiResponse,
  parseJsonApiQuery,
} from '@eduflux-v2/shared/utils/jsonApi';
import { calculateOffset } from '@eduflux-v2/shared/utils/helper';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { GetInstructorUseCase } from '@application/instructor/usecase/GetInstructorUseCase';
import type { GetUserUseCase } from '@application/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@application/user/usecase/UpdateUserUseCase';
import type { BecomeInstructorUseCase } from '@application/user/usecase/BecomeInstructorUseCase';
import { authenticaionMiddleware } from '@api/http/middleware/authenticationMiddleware';
import { getInstructorsSchema } from '@api/http/validators/getInstructorsSchema';

export class UserController {
  constructor(
    @inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(UserDITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(UserDITokens.BecomeInstructorUseCase)
    private readonly becomeInstructorUseCase: BecomeInstructorUseCase,
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
        .post('/me/become-instructor', async ({ user, set }) => {
          const updatedUser = await this.becomeInstructorUseCase.execute({
            userId: user.id,
          });
          set.status = httpStatus.OK;
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
          const parsedQuery = getInstructorsSchema.parse(jsonApiQuery);
          const { totalCount, instructors } =
            await this.getInstructorViewsUseCase.execute({
              executorId: user.id,
              queryParameters: {
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
                filter: parsedQuery.filter,
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
