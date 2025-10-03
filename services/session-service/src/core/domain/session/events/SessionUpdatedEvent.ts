import type { Event } from '@core/common/events/Event';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

export interface SessionUpdatedEvent extends Event {
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
