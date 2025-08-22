import {
  type Resolvers,
  SessionStatus,
} from '../__generated__/resolvers-types';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { UnauthorizedException } from '@/application/exceptions/unauthorised.execption';
import type { SubgraphContext } from '../graphql-handler';
import type { IGetSessionsUseCase } from '@/application/use-cases/interface/get-sessions.use-case';
import { sessionQueryParametersSchema } from '@/infrastructure/http/schema/session';
import { Role } from '@/shared/constants/role';
import { ForbiddenException } from '@/application/exceptions/forbidden.exception';

export class SessionResolver {
  constructor(
    @inject(TYPES.GetSessionUseCase)
    private readonly getSessionsUseCase: IGetSessionsUseCase,
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
