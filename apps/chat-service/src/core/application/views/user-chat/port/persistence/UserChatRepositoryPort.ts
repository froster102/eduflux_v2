import type { UserChat } from "@core/application/views/user-chat/entity/UserChat";
import type { UpdateUserPayload } from "@core/application/views/user-chat/port/persistence/types/UpdateUserPayload";
import type { UserChatQueryResult } from "@core/application/views/user-chat/port/persistence/types/UserChatQueryResult";
import type { Role } from "@core/common/enum/Role";
import type { BaseRepositoryPort } from "@core/common/port/persistence/BaseRepositoryPort";
import type { PaginationQueryParams } from "@core/common/port/persistence/type/QueryParameters";

export interface UserChatRepositoryPort extends BaseRepositoryPort<UserChat> {
  findByUserIdAndRole(
    userId: string,
    role: Role,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<UserChatQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
