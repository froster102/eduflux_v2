import type { SessionStatus } from '@shared/constants/SessionStatus';
import type { Event } from '@shared/events/Event';
import type { SessionEvents } from '@shared/events/session/enum/SessionEvents';

export interface SessionUpdatedEvent extends Event {
  readonly type: SessionEvents.SESSION_UPDATED;
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
