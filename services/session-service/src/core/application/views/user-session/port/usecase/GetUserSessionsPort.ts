import type { UserSessionQueryParameters } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryParameters';
import type { Role } from '@core/common/enums/Role';

export interface GetUserSessionsPort {
  userId: string;
  preferedRole: Role;
  queryParameters?: UserSessionQueryParameters;
}
