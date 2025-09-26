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
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { Role } from '@core/common/enums/Role';
import { Exception } from '@core/common/errors/Exception';
import { Code } from '@core/common/errors/Code';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';

export class UserController {
  constructor(
    @inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(UserDITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(InstructorDITokens.GetInstructorsUseCase)
    private readonly getInstructorsUseCase: GetInstructorsUseCase,
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
          const user = await this.getUserUseCase.execute({
            userId: params.id,
          });
          CoreAssert.isTrue(
            user.roles.includes(Role.INSTRUCTOR),
            Exception.new({ code: Code.ACCESS_DENIED_ERROR }),
          );
          return JSON.stringify(user);
        }),
    );
  }
}
