import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { BookSessionUseCaseResult } from '@core/application/session/usecase/types/BookSessionUseCaseResult';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { InvalidInputException } from '@eduflux-v2/shared/exceptions/InvalidInputException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { SessionBookingService } from '@core/domain/service/SessionBookingService';
import type { Session } from '@core/domain/session/entity/Session';
import type { Slot } from '@core/domain/slot/entity/Slot';
import { envVariables } from '@shared/env/envVariables';
import { inject } from 'inversify';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class BookSessionService implements BookSessionUseCase {
  constructor(
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SlotDITokens.SlotRepository)
    private readonly slotRepository: SlotRepositoryPort,
    @inject(SharedCoreDITokens.UnitOfWork)
    private readonly unitOfWork: UnitOfWork,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
    @inject(SessionSettingsDITokens.SessionSettingsRepository)
    private readonly sessionSettingsRepository: SessionSettingsRepositoryPort,
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
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

    const instructorDetails = await this.userService.getUser(slot.instructorId);

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

    await this.unitOfWork.runTransaction(async (trx) => {
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
      id: newSession.id,
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
