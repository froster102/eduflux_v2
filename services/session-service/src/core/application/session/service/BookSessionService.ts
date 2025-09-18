import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import {
  PaymentPurpose,
  type PaymentServicePort,
} from '@core/application/session/port/gateway/PaymentServicePort';
import type { UserServicePort } from '@core/application/session/port/gateway/UserServicePort';
import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { BookSessionUseCaseResult } from '@core/application/session/usecase/types/BookSessionUseCaseResult';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { UnitOfWork } from '@core/common/unit-of-work/UnitOfWork';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { SessionBookingService } from '@core/domain/service/SessionBookingService';
import type { Session } from '@core/domain/session/entity/Session';
import type { Slot } from '@core/domain/slot/entity/Slot';
import { ImageConfig } from '@shared/config/ImageConfig';
import { envVariables } from '@shared/env/envVariables';
import { inject } from 'inversify';

export class BookSessionService implements BookSessionUseCase {
  constructor(
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(CoreDITokens.PaymentService)
    private readonly paymentService: PaymentServicePort,
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

    const learnerDetails = await this.userService.getUserDetails(userId);

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

    const { checkoutUrl } = await this.paymentService.initiatePayment({
      amount: price * 100,
      currency: 'USD',
      payerId: userId,
      paymentPurpose: PaymentPurpose.INSTRUCTOR_SESSION,
      metadata: {
        name: `Session with ${instructorDetails.firstName} ${instructorDetails.lastName}`,
        image: `${ImageConfig.IMAGE_BASE_URL}${instructorDetails.image}`,
        description: `This is a 60 minutes session with ${instructorDetails.firstName} ${instructorDetails.lastName}`,
        sessionId: newSession.id,
      },
      successUrl: this.createBookingSucessUrl(
        newSession,
        instructorDetails.firstName + ' ' + instructorDetails.lastName,
        learnerDetails.firstName + ' ' + learnerDetails.lastName,
        slot,
      ),
      cancelUrl: this.createBookingCancelUrl(),
    });

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
      id: newSession.id,
      checkoutUrl,
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
