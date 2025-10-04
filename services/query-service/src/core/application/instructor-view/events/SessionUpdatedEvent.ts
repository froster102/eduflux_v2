import type { Event } from "@core/common/events/Event";
import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";
import type { UserSessionEvents } from "@core/domain/user-session/events/enum/UserSessionEvents";

export interface SessionUpdatedEvent extends Event {
  readonly type: UserSessionEvents.SESSION_UPDATED;
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
