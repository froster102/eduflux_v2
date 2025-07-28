import { Session } from '@/domain/entities/session.entity';
import { IUseCase } from './interface/use-case.interface';
import { PaginationQueryParams } from '../dto/pagination.dto';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { ISessionRepository } from '@/domain/repositories/session.repository';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { Role } from '@/shared/constants/role';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface GetUserBookingsInput {
  actor: AuthenticatedUserDto;
  paginationQueryParams: PaginationQueryParams & { role: Role };
}

export interface GetUserBookingsOutput {
  sessions: Session[];
  total: number;
}

export class GetUserBookingsUseCase
  implements IUseCase<GetUserBookingsInput, GetUserBookingsOutput>
{
  constructor(
    @inject(TYPES.SessionRepository)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(
    getUserBookingsInput: GetUserBookingsInput,
  ): Promise<GetUserBookingsOutput> {
    const { actor, paginationQueryParams } = getUserBookingsInput;
    const userRolePreference = paginationQueryParams.role;

    if (!userRolePreference) {
      throw new InvalidInputException(
        `Role field not present in the query params`,
      );
    }

    if (!actor.hasRole(userRolePreference)) {
      throw new ForbiddenException(`You are not authroized for this action.`);
    }

    if (userRolePreference === Role.INSTRUCTOR) {
      const result = await this.sessionRepository.findInstructorSessions(
        actor.id,
        paginationQueryParams,
      );

      return result;
    }

    const results = await this.sessionRepository.findLearnerSessions(
      actor.id,
      paginationQueryParams,
    );

    return results;
  }
}
