import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";
import type { UserSessionEvents } from "@core/domain/user-session/events/enum/UserSessionEvents";

export interface SessionConfimedEvent extends Event {
  readonly type: UserSessionEvents.SESSION_CONFIRMED;
  readonly id: string;
  readonly sessionId: string;
  readonly learnerId: string;
  readonly instructorId: string;
  readonly status: SessionStatus;
  readonly startTime: string;
  readonly endTime: string;
  readonly path: string;
}
