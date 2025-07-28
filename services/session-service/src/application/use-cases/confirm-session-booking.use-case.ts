import type { IUseCase } from './interface/use-case.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface ConfirmSessionBookingInput {
  sessionId: string;
  paymentId: string;
}

export class ConfirmSessionBookingUseCase
  implements IUseCase<ConfirmSessionBookingInput, void>
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
