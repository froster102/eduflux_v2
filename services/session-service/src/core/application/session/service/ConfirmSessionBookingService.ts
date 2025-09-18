import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { ConfirmSessionBookingPort } from '@core/application/session/port/usecase/ConfirmBookingPort';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';

export class ConfirmSessionBookingService
  implements ConfirmSessionBookingUseCase
{
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
  ) {}

  async execute(payload: ConfirmSessionBookingPort): Promise<void> {
    const { sessionId, paymentId } = payload;

    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID:${sessionId} not found.`);
    }

    session.markAsBooked(paymentId);

    await this.sessionRepository.update(session.id, session);
  }
}
