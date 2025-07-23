import {
  AvailabilityStatus,
  InstructorAvailability,
} from '../entities/slot.entity';
import { Session, SessionStatus } from '../entities/session.entity';
import { DomainException } from '../exceptions/domain.exception';

export class SessionBookingService {
  constructor() {}

  createPendingSession(
    availability: InstructorAvailability,
    learnerId: string,
    price: number,
    currency: string,
  ): { updatedAvailability: InstructorAvailability; newSession: Session } {
    if (availability.status !== AvailabilityStatus.AVAILABLE) {
      throw new Error('Selected slot is not available for booking.');
    }

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newSession = Session.create({
      id: sessionId,
      instructorId: availability.instructorId,
      learnerId: learnerId,
      availabilitySlotId: availability.id,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: SessionStatus.PENDING_PAYMENT,
      price: price,
      currency: currency,
      pendingPaymentExpiryTime: null,
    });

    availability.markAsBooked(learnerId, sessionId);

    return { updatedAvailability: availability, newSession: newSession };
  }

  rescheduleSlots(
    originalSession: Session,
    oldAvailability: InstructorAvailability,
    newAvailability: InstructorAvailability,
    userId: string,
  ): {
    updatedSession: Session;
    updatedOldAvailability: InstructorAvailability;
    updatedNewAvailability: InstructorAvailability;
  } {
    if (!originalSession.isParticipant(userId)) {
      throw new DomainException(
        'User is not authorized to reschedule this session.',
      );
    }

    if (newAvailability.status !== AvailabilityStatus.AVAILABLE) {
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
