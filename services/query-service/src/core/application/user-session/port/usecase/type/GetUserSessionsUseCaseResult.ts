import type { UserSession } from "@core/domain/user-session/entity/UserSession";

export type GetUserSessionsUseCaseResult = {
  sessions: UserSession[];
  totalCount: number;
};
