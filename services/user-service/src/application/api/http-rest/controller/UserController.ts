import { authenticaionMiddleware } from '@application/api/http-rest/middleware/authenticationMiddleware';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import type { GetInstructorsUseCase } from '@core/domain/instructor/usecase/GetInstructorsUseCase';
import type { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import type { UpdateUserUseCase } from '@core/domain/user/usecase/UpdateUserUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';
import httpStatus from 'http-status';
import { updateUserSchema } from '@application/api/http-rest/schema/user';
import { queryParametersSchema } from '@application/api/http-rest/schema/queryParametersSchema';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import type { GetInstructorUseCase } from '@core/domain/instructor/usecase/GetInstructorUseCase';
import { LearnerStatsDITokens } from '@core/domain/learner-stats/di/LearnerStatsDITokens';
import type { GetLearnerStatsUseCase } from '@core/domain/learner-stats/usecase/GetLearnerStatsUseCase';

export class UserController {
  constructor(
    @inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(UserDITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(InstructorDITokens.GetInstructorsUseCase)
    private readonly getInstructorsUseCase: GetInstructorsUseCase,
    @inject(InstructorDITokens.GetInstructorUseCase)
    private readonly getInstructorUseCase: GetInstructorUseCase,
    @inject(LearnerStatsDITokens.GetLearnerStatsUseCase)
    private readonly getLearnerStatsUseCase: GetLearnerStatsUseCase,
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
            await this.getInstructorsUseCase.execute({
              currentUserId: user.id,
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
        .get('/:id', async ({ params }) => {
          const instructor = await this.getInstructorUseCase.execute({
            instructorId: params.id,
          });

          return JSON.stringify(instructor);
        }),
    );
  }
}
