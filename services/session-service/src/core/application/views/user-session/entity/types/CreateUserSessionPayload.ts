import type { SessionParticipant } from '@core/application/views/user-session/entity/types/SessionParticipant';
import type { SessionStatus } from '@core/domain/session/enum/SessionStatus';

export type CreateUserSessionPayload = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  learner: SessionParticipant;
  instructor: SessionParticipant;
};
