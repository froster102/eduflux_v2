import type { SessionStatus } from '@shared/constants/SessionStatus';
import type { Event } from '@shared/events/Event';
import type { SessionEvents } from '@shared/events/session/enum/SessionEvents';

export interface SessionConfirmedEvent extends Event {
  readonly type: SessionEvents.SESSION_CONFIRMED;
  readonly id: string;
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly path: string;
  readonly joinLink: string;
}
