import type { SessionStatus } from '@shared/constants/SessionStatus';
import { Event } from '@shared/events/Event';
import { SessionEvents } from '@shared/events/session/enum/SessionEvents';

export interface SessionUpdatedEventPayload {
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class SessionUpdatedEvent extends Event<SessionUpdatedEventPayload> {
  static readonly EVENT_NAME: string = SessionEvents.SESSION_UPDATED;

  constructor(id: string, payload: SessionUpdatedEventPayload) {
    super({ id, name: SessionEvents.SESSION_UPDATED }, payload);
  }
}
