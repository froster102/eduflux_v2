import type { SessionStatus } from '@shared/constants/SessionStatus';
import { Event } from '@shared/events/Event';
import { SessionEvents } from '@shared/events/session/enum/SessionEvents';

export interface SessionCompletedEventPayload {
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class SessionCompletedEvent extends Event<SessionCompletedEventPayload> {
  static readonly EVENT_NAME: string = SessionEvents.SESSION_COMPLETED;

  constructor(id: string, payload: SessionCompletedEventPayload) {
    super({ id, name: SessionEvents.SESSION_COMPLETED }, payload);
  }
}
