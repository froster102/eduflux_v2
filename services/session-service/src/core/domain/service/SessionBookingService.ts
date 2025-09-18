import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { UnauthorizedException } from '@core/common/exception/UnauthorizedException';
import { Session } from '@core/domain/session/entity/Session';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import type { Slot } from '@core/domain/slot/entity/Slot';
import { SlotStatus } from '@core/domain/slot/enum/SlotStatus';

export class SessionBookingService {
  static createPendingSession(
    slot: Slot,
    learnerId: string,
    price: number,
    currency: string,
  ): { updatedSlot: Slot; newSession: Session } {
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new InvalidInputException(
        'Selected slot is not available for booking.',
      );
    }

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newSession = Session.create({
      id: sessionId,
      instructorId: slot.instructorId,
      learnerId: learnerId,
      availabilitySlotId: slot.id,
      startTime: slot.startTime,
      paymentId: null,
      endTime: slot.endTime,
      status: SessionStatus.PENDING_PAYMENT,
      price: price,
      currency: currency,
      pendingPaymentExpiryTime: null,
    });

    slot.markAsBooked(learnerId, sessionId);

    return { updatedSlot: slot, newSession: newSession };
  }

  static rescheduleSlots(
    originalSession: Session,
    oldAvailability: Slot,
    newAvailability: Slot,
    executorId: string,
  ): {
    updatedSession: Session;
    updatedOldAvailability: Slot;
    updatedNewAvailability: Slot;
  } {
    if (!originalSession.isParticipant(executorId)) {
      throw new UnauthorizedException(
        'User is not authorized to reschedule this session.',
      );
    }

    if (newAvailability.status !== SlotStatus.AVAILABLE) {
      throw new InvalidInputException(
        'New desired slot is not available for booking.',
      );
    }

    if (newAvailability.instructorId !== originalSession.instructorId) {
      throw new InvalidInputException(
        'Cannot reschedule with a different instructor.',
      );
    }

    if (newAvailability.startTime < new Date()) {
      throw new InvalidInputException('Cannot reschedule to a past time slot.');
    }

    oldAvailability.markAsAvailable();

    newAvailability.markAsBooked(originalSession.learnerId, originalSession.id);

    originalSession.markAsRescheduled(
      newAvailability.id,
      newAvailability.startTime,
      newAvailability.endTime,
    );

    return {
      updatedSession: originalSession,
      updatedOldAvailability: oldAvailability,
      updatedNewAvailability: newAvailability,
    };
  }

  //cancellation currently not applicable
  //   cancelSession(
  //     session: Session,
  //     availability: InstructorAvailability,
  //   ): { updatedSession: Session; updatedAvailability: InstructorAvailability } {
  //     if (session.status === SessionStatus.CANCELLED) {
  //       throw new Error('Session is already cancelled.');
  //     }
  //     session.markAsCancelled();
  //     availability.markAsAvailable();

  //     return { updatedSession: session, updatedAvailability: availability };
  //   }
}
