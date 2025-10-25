import type { SessionStatus } from '@core/common/enum/SessionStatus';
import type { SessionEvents } from '@core/common/events/enum/SessionEvents';
import type { Event } from '@core/common/events/Event';

export interface SessionConfimedEvent extends Event {
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
