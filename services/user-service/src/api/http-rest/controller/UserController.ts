import { authenticaionMiddleware } from 'src/api/http-rest/middleware/authenticationMiddleware';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';
import httpStatus from 'http-status';
import { updateUserSchema } from 'src/api/http-rest/schema/user';
import { queryParametersSchema } from 'src/api/http-rest/schema/queryParametersSchema';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { GetLearnerStatsUseCase } from '@core/application/learner-stats/usecase/GetLearnerStatsUseCase';
import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { GetInstructorViewsUseCase } from '@core/application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewUseCase } from '@core/application/views/instructor-view/usecase/GetInstructorViewUseCase';

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
          const parsedQuery = queryParametersSchema.parse(query);
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
        }),
    );
  }
}
