import type { Event } from '@core/common/events/Event';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import type { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';

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
