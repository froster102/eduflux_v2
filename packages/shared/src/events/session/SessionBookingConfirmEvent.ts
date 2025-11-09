import { SessionEvents } from '@shared/events/session/enum/SessionEvents';
import { Event } from '@shared/events/Event';

export interface SessionBookingConfirmEventPayload {
  readonly paymentId: string;
  readonly instructorId: string;
  readonly learnerId: string;
  readonly sessionId: string;
}

export class SessionBookingConfirmEvent extends Event<SessionBookingConfirmEventPayload> {
  static readonly EVENT_NAME = SessionEvents.SESSION_BOOKING_CONFIRMED;

  constructor(id: string, payload: SessionBookingConfirmEventPayload) {
    super({ id, name: SessionEvents.SESSION_BOOKING_CONFIRMED }, payload);
  }
}
