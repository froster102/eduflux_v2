import type { Event } from '@core/common/events/Event';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import type { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';

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
