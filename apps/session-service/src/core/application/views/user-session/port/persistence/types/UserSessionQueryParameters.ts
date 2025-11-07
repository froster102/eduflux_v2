import type { PaginationQueryParams as QueryParameters } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import type { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import type { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';
import type { Role } from '@eduflux-v2/shared/constants/Role';

export interface UserSessionQueryParameters extends QueryParameters {
  filter: {
    status?: SessionStatus;
    sort?: Record<string, SortOrder>;
    preferedRole: Role;
    search?: string;
  };
}
