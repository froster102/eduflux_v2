import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface GetUserChatsPort {
  userId: string;
  role: Role;
  paginationQueryParams: PaginationQueryParams;
}
