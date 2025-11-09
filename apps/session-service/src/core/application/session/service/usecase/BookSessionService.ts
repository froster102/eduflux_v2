import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { InvalidInputException } from '@eduflux-v2/shared/exceptions/InvalidInputException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { SessionBookingService } from '@core/domain/service/SessionBookingService';
import { inject } from 'inversify';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { SessionUseCaseDto } from '@core/application/session/usecase/dto/SessionUseCaseDto';

export class BookSessionService implements BookSessionUseCase {
  constructor(
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SlotDITokens.SlotRepository)
    private readonly slotRepository: SlotRepositoryPort,
    @inject(SharedCoreDITokens.UnitOfWork)
    private readonly unitOfWork: UnitOfWork,
    @inject(SessionSettingsDITokens.SessionSettingsRepository)
    private readonly sessionSettingsRepository: SessionSettingsRepositoryPort,
  ) {}

  async execute(payload: BookSessionPort): Promise<SessionUseCaseDto> {
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

    return SessionUseCaseDto.fromEntity(newSession);
  }
}
