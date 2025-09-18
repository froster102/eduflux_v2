import type {
  Resolvers,
  SessionStatus,
} from '@api/graphql/__generated__/resolvers-types';
import type { SubgraphContext } from '@api/graphql/graphql-handler';
import { sessionQueryParametersSchema } from '@api/http-rest/schema/session';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { GetSessionsUseCase } from '@core/application/session/usecase/GetSessionUseCase';
import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { UnauthorizedException } from '@core/common/exception/UnauthorizedException';
import { inject } from 'inversify';

export class SessionResolver {
  constructor(
    @inject(SessionDITokens.GetSessionUseCase)
    private readonly getSessionsUseCase: GetSessionsUseCase,
  ) {}

  getResolvers(): Resolvers {
    return {
      Query: {
        sessions: async (_, args, context) => {
          const parsedArgs = sessionQueryParametersSchema.parse(args);
          const user = this.getAuthenticatedUser(context);
          if (parsedArgs.type === 'instructor') {
            if (!user.hasRole(Role.INSTRUCTOR)) {
              throw new ForbiddenException('Access Denied');
            }
          }
          const { totalCount, sessions } =
            await this.getSessionsUseCase.execute({
              exectorId: this.getAuthenticatedUser(context).id,
              queryParmeters: {
                limit: parsedArgs.limit,
                offset: (parsedArgs.page - 1) * parsedArgs.limit,
                type: parsedArgs.type,
              },
            });
          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedArgs.limit),
              currentPage: args.page,
            },
            sessions: sessions.map((session) => ({
              id: session.id,
              instructor: { id: session.instructorId },
              learner: { id: session.learnerId },
              startTime: session.startTime.toISOString(),
              endTime: session.endTime.toISOString(),
              status: session.status as unknown as SessionStatus,
            })),
          };
        },
      },
    };
  }

  private getAuthenticatedUser(context: SubgraphContext): AuthenticatedUserDto {
    const user = context.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
