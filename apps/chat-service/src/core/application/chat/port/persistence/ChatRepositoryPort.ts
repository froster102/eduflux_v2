import type { ChatQueryResult } from '@core/application/chat/port/persistence/type/ChatQueryResult';
import type { Role } from '@core/common/enum/Role';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { PaginationQueryParams } from '@core/common/port/persistence/type/QueryParameters';
import { Chat } from '@core/domain/chat/entity/Chat';

export interface ChatRepositoryPort extends BaseRepositoryPort<Chat> {
  findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: PaginationQueryParams,
  ): Promise<ChatQueryResult>;
  findExistingChat(userIds: string[]): Promise<Chat | null>;
}
