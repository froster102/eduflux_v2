import type { ChatQueryResult } from '@core/application/chat/port/persistence/type/ChatQueryResult';
import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import { Chat } from '@core/domain/chat/entity/Chat';

export interface ChatRepositoryPort extends BaseRepositoryPort<Chat> {
  findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: PaginationQueryParams,
  ): Promise<ChatQueryResult>;
  findExistingChat(userIds: string[]): Promise<Chat | null>;
}
