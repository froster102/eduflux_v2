import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";
import type { UserSessionEvents } from "@core/domain/user-session/events/enum/UserSessionEvents";

export type ConfirmSessionEvent = {
  type: UserSessionEvents.SESSION_CONFIRMED;
  data: {
    sessionId: string;
    learnerId: string;
    instructorId: string;
    status: SessionStatus;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  };
};
