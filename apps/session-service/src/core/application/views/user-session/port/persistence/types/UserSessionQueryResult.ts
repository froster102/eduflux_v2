import type { UserSession } from '@core/application/views/user-session/entity/UserSession';

export type UserSessionQueryResult = {
  sessions: UserSession[];
  totalCount: number;
};
