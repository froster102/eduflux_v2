import type { Role } from '@core/common/enum/Role';
import type { PaginationQueryParams } from '@core/common/port/persistence/type/QueryParameters';

export interface UserChatQueryParams extends PaginationQueryParams {
  filter: {
    role: Role.INSTRUCTOR | Role.LEARNER;
  };
}
