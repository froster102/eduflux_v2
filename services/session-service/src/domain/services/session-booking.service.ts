import { Session, SessionStatus } from '../entities/session.entity';
import { Slot, SlotStatus } from '../entities/slot.entity';
import { DomainException } from '../exceptions/domain.exception';
// import { v4 as uuidv4 } from 'uuid';

export class SessionBookingService {
  createPendingSession(
    slot: Slot,
    learnerId: string,
    price: number,
    currency: string,
  ): { updatedSlot: Slot; newSession: Session } {
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new DomainException('Selected slot is not available for booking.');
    }

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newSession = Session.create({
      id: sessionId,
      instructorId: slot.instructorId,
      learnerId: learnerId,
      availabilitySlotId: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: SessionStatus.PENDING_PAYMENT,
      price: price,
      currency: currency,
      pendingPaymentExpiryTime: null,
    });

    slot.markAsBooked(learnerId, sessionId);

    return { updatedSlot: slot, newSession: newSession };
  }

  rescheduleSlots(
    originalSession: Session,
    oldAvailability: Slot,
    newAvailability: Slot,
    userId: string,
  ): {
    updatedSession: Session;
    updatedOldAvailability: Slot;
    updatedNewAvailability: Slot;
  } {
    if (!originalSession.isParticipant(userId)) {
      throw new DomainException(
        'User is not authorized to reschedule this session.',
      );
    }

    if (newAvailability.status !== SlotStatus.AVAILABLE) {
      throw new DomainException(
        'New desired slot is not available for booking.',
      );
    }

    if (newAvailability.instructorId !== originalSession.instructorId) {
      throw new DomainException(
        'Cannot reschedule with a different instructor.',
      );
    }

    if (newAvailability.startTime < new Date()) {
      throw new DomainException('Cannot reschedule to a past time slot.');
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
