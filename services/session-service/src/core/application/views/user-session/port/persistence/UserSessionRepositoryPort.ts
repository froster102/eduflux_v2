import type { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { UpdateUserPayload } from '@core/application/views/user-session/port/persistence/types/UpdateUserPayload';
import type { UserSessionQueryParameters } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryParameters';
import type { UserSessionQueryResult } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryResult';
import type { Role } from '@core/common/enums/Role';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';

export interface UserSessionRepositoryPort
  extends BaseRepositoryPort<UserSession> {
  listUserSessions(
    userId: string,
    preferedRole: Role,
    queryParmeters?: UserSessionQueryParameters,
  ): Promise<UserSessionQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
