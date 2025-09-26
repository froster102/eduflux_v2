import type { UserSessionQueryParameters } from "@core/application/user-session/port/persistence/type/UserSessionQueryParameters";
import type { Role } from "@shared/constants/roles";

export interface GetUserSessionsPort {
  userId: string;
  preferedRole: Role;
  queryParameters?: UserSessionQueryParameters;
}
