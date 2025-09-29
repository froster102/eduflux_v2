import type { UserChat } from "@core/domain/user-chat/entity/UserChat";
import type { UserChatQueryResult } from "@core/application/user-chat/port/persistence/types/UserChatQueryResult";
import type { BaseRepositoryPort } from "@core/common/port/persistence/BaseRepositoryPort";
import type { QueryParameters } from "@core/common/port/persistence/types/QueryParameters";
import type { Role } from "@shared/constants/roles";
import type { UpdateUserPayload } from "@core/common/port/persistence/types/UpdateUserPayload";

export interface UserChatRepositoryPort extends BaseRepositoryPort<UserChat> {
  findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: QueryParameters,
  ): Promise<UserChatQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
