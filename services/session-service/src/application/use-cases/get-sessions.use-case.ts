import type {
  ISessionRepository,
  SessionQueryResults,
} from '@/domain/repositories/session.repository';
import type {
  GetSessionsInput,
  IGetSessionsUseCase,
} from './interface/get-sessions.use-case';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export class GetSessionsUseCase implements IGetSessionsUseCase {
  constructor(
    @inject(TYPES.SessionRepository)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(
    getSessionsInput: GetSessionsInput,
  ): Promise<SessionQueryResults> {
    const { exectorId, queryParmeters } = getSessionsInput;
    const result = await this.sessionRepository.listSessions(
      exectorId,
      queryParmeters,
    );
    return result;
  }
}
