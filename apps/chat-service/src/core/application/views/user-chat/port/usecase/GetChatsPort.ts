import type { Role } from '@core/common/enum/Role';
import type { PaginationQueryParams } from '@core/common/port/persistence/type/QueryParameters';

export interface GetUserChatsPort {
  userId: string;
  role: Role;
  paginationQueryParams: PaginationQueryParams;
}
