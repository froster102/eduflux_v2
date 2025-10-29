import type { Event } from '@eduflux-v2/shared/events/Event';
import type { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import type { SessionEvents } from '@eduflux-v2/shared/events/session/enum/SessionEvents';

export interface UserSessionUpdatedEvent extends Event {
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
