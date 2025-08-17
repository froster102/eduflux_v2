import type {
  GetUserBookingsInput,
  GetUserBookingsOutput,
  IGetUserBookingsUseCase,
} from './interface/get-user-bookings.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export class GetUserBookingsUseCase implements IGetUserBookingsUseCase {
  constructor(
    @inject(TYPES.SessionRepository)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(
    getUserBookingsInput: GetUserBookingsInput,
  ): Promise<GetUserBookingsOutput> {
    const { userId, queryOptions } = getUserBookingsInput;
    const results = await this.sessionRepository.findLearnerSessions(
      userId,
      queryOptions,
    );

    return results;
  }
}
