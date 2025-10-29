import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface GetChatsPort {
  userId: string;
  role: Role;
  queryParameters?: PaginationQueryParams;
}
