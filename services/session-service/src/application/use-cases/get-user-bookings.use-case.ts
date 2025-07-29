import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { ISessionRepository } from '@/domain/repositories/session.repository';
import { Role } from '@/shared/constants/role';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import {
  GetUserBookingsInput,
  GetUserBookingsOutput,
  IGetUserBookingsUseCase,
} from './interface/get-user-bookings.interface';

export class GetUserBookingsUseCase implements IGetUserBookingsUseCase {
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
