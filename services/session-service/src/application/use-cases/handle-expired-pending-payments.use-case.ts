import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import type { IUnitOfWork } from '../ports/unit-of-work.interface';
import { Session } from '@/domain/entities/session.entity';
import { Slot } from '@/domain/entities/slot.entity';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';

export class HandleExpiredPendingPaymentsUseCase
  implements IUseCase<void, void>
{
  private logger = new Logger(SESSION_SERVICE);
  constructor(
    @inject(TYPES.SessionRepository)
    private readonly sessionRepository: ISessionRepository,
    @inject(TYPES.SlotRepository)
    private readonly slotRepository: ISlotRepository,
    @inject(TYPES.UnitOfWork)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(): Promise<void> {
    this.logger.info('Running HandleExpiredPendingPaymentsUseCase...');
    const now = new Date();
    const pendingSessions = await this.sessionRepository.findPendingExpired(
      now,
      5,
    );

    const sessionUpdates: { id: string; data: Partial<Session> }[] = [];
    const slotIdsToFetch: Set<string> = new Set();
    const processedSessionIds: Set<string> = new Set();

    for (const session of pendingSessions) {
      session.markAsPaymentExpired();
      sessionUpdates.push({ id: session.id, data: { status: session.status } });

      if (session.availabilitySlotId) {
        slotIdsToFetch.add(session.availabilitySlotId);
      }
      processedSessionIds.add(session.id);
    }

    const slotsMap: Map<string, Slot> = new Map();

    if (slotIdsToFetch.size > 0) {
      try {
        const slots = await this.slotRepository.findByIds(
          Array.from(slotIdsToFetch),
        );
        slots.forEach((slot) => slotsMap.set(slot.id, slot));
      } catch (error) {
        this.logger.error(
          `Failed to fetch availability slots for expired sessions. Proceeding with session updates only.`,
          error as Record<string, any>,
        );
      }
    }

    const slotUpdates: { id: string; data: Partial<Slot> }[] = [];
    const sessionsWithMissingSlots: string[] = [];

    for (const session of pendingSessions) {
      if (!processedSessionIds.has(session.id)) {
        continue;
      }
      if (session.availabilitySlotId) {
        const slot = slotsMap.get(session.id);
        if (slot) {
          slot.markAsAvailable();
          slotUpdates.push({ id: slot.id, data: slot });
        } else {
          sessionsWithMissingSlots.push(session.id);
          this.logger.warn(
            `Availability slot ${session.availabilitySlotId} not found for session ${session.id} during expiry cleanup. It might have been deleted or not fetched.`,
          );
        }
      }
    }

    try {
      await this.uow.runTransaction(async (trx) => {
        if (sessionUpdates.length > 0) {
          await trx.sessionRepository.updateMany(sessionUpdates);
          this.logger.info(
            `Successfully marked ${sessionUpdates.length} as payment expired.`,
          );
        }

        if (slotUpdates.length > 0) {
          await trx.slotRepository.updateMany(slotUpdates);
          this.logger.info(
            `Successfully marked ${slotUpdates.length} slots as available.`,
          );
        }

        this.logger.info(
          `${HandleExpiredPendingPaymentsUseCase.name} completed successfully.`,
        );
      });
    } catch (error) {
      this.logger.error(
        'Failed to update sessions or slots in batch. Transaction rolled back.',
        error as Record<string, any>,
      );
    }
  }
}
