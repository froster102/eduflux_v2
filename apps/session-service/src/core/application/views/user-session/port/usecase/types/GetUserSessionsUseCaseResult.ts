import type { UserSession } from '@core/application/views/user-session/entity/UserSession';

export type GetUserSessionsUseCaseResult = {
  sessions: UserSession[];
  totalCount: number;
};
