import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import { User } from '@domain/user/entity/User';

export type UserQueryResults = {
  users: User[];
  totalCount: number;
};

export interface UserQueryParameters extends PaginationQueryParams {
  roles?: Role[];
}
