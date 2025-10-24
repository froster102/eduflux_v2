import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { UserServicePort } from '@core/application/session/port/gateway/UserServicePort';
import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { BookSessionUseCaseResult } from '@core/application/session/usecase/types/BookSessionUseCaseResult';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { UnitOfWork } from '@core/common/unit-of-work/UnitOfWork';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { SessionBookingService } from '@core/domain/service/SessionBookingService';
import type { Session } from '@core/domain/session/entity/Session';
import type { Slot } from '@core/domain/slot/entity/Slot';
import { envVariables } from '@shared/env/envVariables';
import { inject } from 'inversify';

export class BookSessionService implements BookSessionUseCase {
  constructor(
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SlotDITokens.SlotRepository)
    private readonly slotRepository: SlotRepositoryPort,
    @inject(CoreDITokens.UnitOfWork) private readonly uow: UnitOfWork,
    @inject(SessionSettingsDITokens.SessionSettingsRepository)
    private readonly sessionSettingsRepository: SessionSettingsRepositoryPort,
  ) {}

  async execute(payload: BookSessionPort): Promise<BookSessionUseCaseResult> {
    const { userId, slotId } = payload;
    const slot = CoreAssert.notEmpty(
      await this.slotRepository.findById(slotId),
      new NotFoundException(`Availability slot with ID ${slotId} not found.`),
    );

    if (slot.endTime < new Date()) {
      throw new InvalidInputException(
        'Cannot book a slot that has already passed.',
      );
    }

    const instructorDetails = await this.userService.getUserDetails(
      slot.instructorId,
    );

    if (!instructorDetails) {
      throw new NotFoundException('Instructor details not found.');
    }

    const sessionSettings = await this.sessionSettingsRepository.findByUserId(
      slot.instructorId,
    );

    if (!sessionSettings) {
      throw new NotFoundException('Instructor settings not found.');
    }

    const { price } = sessionSettings;

    const { newSession, updatedSlot } =
      SessionBookingService.createPendingSession(slot, userId, price, 'USD');

    await this.uow.runTransaction(async (trx) => {
      await trx.sessionRepository.save(newSession);
      await trx.slotRepository.update(updatedSlot.id, updatedSlot);
    });

    // `Session with ${instructorDetails.name} from ${newSession.startTime.toLocaleString()} to ${newSession.endTime.toLocaleString()}`,

    // if (!paymentResult.success) {
    //   // Payment failed: revert session and availability state
    //   newSession.status = SessionStatus.CANCELLED; // Or add a FAILED status
    //   await this.sessionRepository.update(newSession);
    //   updatedAvailability.markAsAvailable(); // Revert availability to available
    //   await this.availabilityRepository.update(updatedAvailability);
    //   throw new Error(
    //     `Payment failed: ${paymentResult.message || 'Unknown error'}`,
    //   );
    // }

    // Update session status after successful payment
    // newSession.markAsBooked(paymentResult.paymentId);
    // await this.sessionRepository.update(newSession);
    // await this.availabilityRepository.update(updatedAvailability);

    // Send notifications

    return {
      item: {
        amount: newSession.price,
        title: `A  Session with instructor${instructorDetails.firstName + ' ' + instructorDetails.lastName}`,
        image: instructorDetails.image,
      },
      itemType: 'session',
      referenceId: newSession.id,
    };
  }

  private createBookingSucessUrl(
    session: Session,
    instructor: string,
    user: string,
    slot: Slot,
  ): string {
    const baseUrl = envVariables.PAYMENT_SUCCESS_URL;
    const queryParams = `success=true&sessionId=${session.id}&instructor=${instructor}&user=${user}&startTime=${slot.startTime.toISOString()}&endTime=${slot.endTime.toISOString()}`;
    return `${baseUrl}?${queryParams}`;
  }

  private createBookingCancelUrl(): string {
    const baseUrl = envVariables.PAYMENT_SUCCESS_URL;
    const queryParams = `success=false`;
    return `${baseUrl}?${queryParams}`;
  }
}
