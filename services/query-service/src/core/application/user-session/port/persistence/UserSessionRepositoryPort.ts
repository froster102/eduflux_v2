import type { UserSessionQueryParameters } from "@core/application/user-session/port/persistence/type/UserSessionQueryParameters";
import type { UserSessionQueryResult } from "@core/application/user-session/port/persistence/type/UserSessionQueryResult";
import type { BaseRepositoryPort } from "@core/common/port/persistence/BaseRepositoryPort";
import type { UpdateUserPayload } from "@core/common/port/persistence/types/UpdateUserPayload";
import type { UserSession } from "@core/domain/user-session/entity/UserSession";
import type { Role } from "@shared/constants/roles";

export interface UserSessionRepositoryPort
  extends BaseRepositoryPort<UserSession> {
  listUserSessions(
    userId: string,
    preferedRole: Role,
    queryParmeters?: UserSessionQueryParameters,
  ): Promise<UserSessionQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
