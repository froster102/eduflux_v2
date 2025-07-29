import type {
  ConfirmSessionBookingInput,
  IConfirmSessionBookingUseCase,
} from './interface/confirm-session-booking.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class ConfirmSessionBookingUseCase
  implements IConfirmSessionBookingUseCase
{
  constructor(
    @inject(TYPES.SessionRepository)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(
    confirmSessionBookingInput: ConfirmSessionBookingInput,
  ): Promise<void> {
    const { sessionId, paymentId } = confirmSessionBookingInput;

    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID:${sessionId} not found.`);
    }

    session.markAsBooked(paymentId);

    await this.sessionRepository.update(session.id, session);
  }
}
