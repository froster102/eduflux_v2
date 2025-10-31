import type { SessionStatus } from '@shared/constants/SessionStatus';
import { Event } from '@shared/events/Event';
import { SessionEvents } from '@shared/events/session/enum/SessionEvents';

export interface SessionConfirmedEventPayload {
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly path: string;
  readonly joinLink: string;
}

export class SessionConfirmedEvent extends Event<SessionConfirmedEventPayload> {
  static readonly EVENT_NAME: string = SessionEvents.SESSION_CONFIRMED;

  constructor(id: string, payload: SessionConfirmedEventPayload) {
    super({ id, name: SessionEvents.SESSION_CONFIRMED }, payload);
  }
}
