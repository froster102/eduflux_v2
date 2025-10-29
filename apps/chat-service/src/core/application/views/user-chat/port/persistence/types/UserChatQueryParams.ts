import type { Role } from '@eduflux-v2/shared/constants/Role';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface UserChatQueryParams extends PaginationQueryParams {
  filter: {
    role: Role.INSTRUCTOR | Role.LEARNER;
  };
}
