import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { SessionUseCaseDto } from '@core/application/session/usecase/dto/SessionUseCaseDto';
import type {
  GetSessionPort,
  GetSessionUseCase,
} from '@core/application/session/usecase/GetSessionUseCase';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';

export class GetSessionService implements GetSessionUseCase {
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
  ) {}
  async execute(payload: GetSessionPort): Promise<SessionUseCaseDto> {
    const { sessionId } = payload;

    const session = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found exception'),
    );

    return SessionUseCaseDto.fromEntity(session);
  }
}
