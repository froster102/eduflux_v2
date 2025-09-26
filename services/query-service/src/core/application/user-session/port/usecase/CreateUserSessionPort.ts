import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";

export interface CreateUserSessionPort {
  id: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
  learnerId: string;
}
