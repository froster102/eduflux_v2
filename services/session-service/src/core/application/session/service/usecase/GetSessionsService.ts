import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { SessionQueryResults } from '@core/application/session/port/persistence/type/SessionQueryResult';
import type { GetSessionsPort } from '@core/application/session/port/usecase/GetSessionsPort';
import type { GetSessionsUseCase } from '@core/application/session/usecase/GetSessionsUseCase';
import { inject } from 'inversify';

export class GetSessionsService implements GetSessionsUseCase {
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
  ) {}

  async execute(payload: GetSessionsPort): Promise<SessionQueryResults> {
    const { exectorId, queryParmeters } = payload;
    const result = await this.sessionRepository.listSessions(
      exectorId,
      queryParmeters,
    );
    return result;
  }
}
