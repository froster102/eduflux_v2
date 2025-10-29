import type { UserSessionQueryParameters } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryParameters';
import type { Role } from '@eduflux-v2/shared/constants/Role';

export interface GetUserSessionsPort {
  userId: string;
  preferedRole: Role;
  queryParameters?: UserSessionQueryParameters;
}
