import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";

export type ConfirmSessionEvent = {
  type: "session.confirmed";
  correlationId: "";
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
