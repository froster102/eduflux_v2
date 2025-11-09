import { User } from '@domain/user/entity/User';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type {
  UserQueryParameters,
  UserQueryResults,
} from '@application/user/port/persistence/types/UserQueryParameter';
import type { PaginationQueryParams as QueryParameters } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface UserRepositoryPort extends BaseRepositoryPort<User> {
  findUsers(
    queryParameters: UserQueryParameters,
    excludeId?: string,
  ): Promise<UserQueryResults>;
  findInstructors(
    currentUserId: string,
    queryParameters: QueryParameters,
  ): Promise<UserQueryResults>;
}
