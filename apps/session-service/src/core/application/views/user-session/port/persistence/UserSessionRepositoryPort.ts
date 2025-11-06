import type { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { UpdateUserPayload } from '@core/application/views/user-session/port/persistence/types/UpdateUserPayload';
import type { UserSessionQueryParameters } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryParameters';
import type { UserSessionQueryResult } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryResult';
import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';

export interface UserSessionRepositoryPort
  extends BaseRepositoryPort<UserSession> {
  upsert(session: UserSession): Promise<void>;
  listUserSessions(
    userId: string,
    preferedRole: Role,
    queryParmeters?: UserSessionQueryParameters,
  ): Promise<UserSessionQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
