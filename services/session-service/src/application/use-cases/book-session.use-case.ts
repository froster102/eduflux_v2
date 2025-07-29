import type { IUnitOfWork } from '../ports/unit-of-work.interface';
import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import type { IUserServiceGateway } from '../ports/user-service.gateway';
import {
  PaymentPurpose,
  type IPaymentServiceGateway,
} from '../ports/payment-service.gateway';
import type {
  BookSessionInput,
  BookSessionOutput,
  IBookSessionUseCase,
} from './interface/book-session.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { SessionBookingService } from '@/domain/services/session-booking.service';
import { envVariables } from '@/shared/validation/env-variables';
import { imageConfig } from '@/shared/config/image.config';
import { Session } from '@/domain/entities/session.entity';
import { Slot } from '@/domain/entities/slot.entity';

export class BookSessionUseCase implements IBookSessionUseCase {
  constructor(
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
    @inject(TYPES.PaymentServiceGateway)
    private readonly paymentServiceGateway: IPaymentServiceGateway,
    @inject(TYPES.SlotRepository)
    private readonly slotRepository: ISlotRepository,
    @inject(TYPES.SessionBookingService)
    private readonly sessionBookingService: SessionBookingService,
    @inject(TYPES.UnitOfWork) private readonly uow: IUnitOfWork,
  ) {}

  async execute(
    bookSessionInput: BookSessionInput,
  ): Promise<BookSessionOutput> {
    const { userId, slotId } = bookSessionInput;
    const slot = await this.slotRepository.findById(slotId);

    if (!slot) {
      throw new NotFoundException(
        `Availability slot with ID ${slot} not found.`,
      );
    }

    const learnerDetails = await this.userServiceGateway.getUserDetails(userId);

    const instructorDetails = await this.userServiceGateway.getUserDetails(
      slot.instructorId,
    );

    if (!instructorDetails) {
      throw new NotFoundException('Instructor details not found.');
    }

    const { price: sessionPrice } =
      await this.userServiceGateway.getInstructorSessionPricng(
        slot.instructorId,
      );

    const { newSession, updatedSlot } =
      this.sessionBookingService.createPendingSession(
        slot,
        userId,
        sessionPrice,
        'USD',
      );

    const { checkoutUrl } = await this.paymentServiceGateway.initiatePayment({
      amount: sessionPrice * 100,
      currency: 'USD',
      payerId: userId,
      paymentPurpose: PaymentPurpose.INSTRUCTOR_SESSION,
      metadata: {
        name: `Session with ${instructorDetails.firstName} ${instructorDetails.lastName}`,
        image: `${imageConfig.IMAGE_BASE_URL}${instructorDetails.image}`,
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
