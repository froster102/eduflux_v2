import type { SessionStatus } from '@core/common/enums/SessionStatus';
import type { SessionEvents } from '@core/common/events/enum/SessionEvents';
import type { Event } from '@core/common/events/Event';

export interface SessionCompletedEvent extends Event {
  readonly type: SessionEvents.SESSION_COMPLETED;
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
