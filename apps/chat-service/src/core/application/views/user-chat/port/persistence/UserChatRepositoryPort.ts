import type { UserChat } from '@core/application/views/user-chat/entity/UserChat';
import type { UpdateUserPayload } from '@core/application/views/user-chat/port/persistence/types/UpdateUserPayload';
import type { UserChatQueryResult } from '@core/application/views/user-chat/port/persistence/types/UserChatQueryResult';
import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface UserChatRepositoryPort extends BaseRepositoryPort<UserChat> {
  findByUserIdAndRole(
    userId: string,
    role: Role,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<UserChatQueryResult>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
}
