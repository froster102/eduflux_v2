import type { UserSession } from "@core/domain/user-session/entity/UserSession";

export type UserSessionQueryResult = {
  sessions: UserSession[];
  totalCount: number;
};
