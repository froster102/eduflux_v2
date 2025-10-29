import type { PaginationQueryParams as QueryParameters } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import type { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';

export interface SessionQueryParameters extends QueryParameters {
  filters?: {
    status?: SessionStatus;
  };
  type?: 'learner' | 'instructor';
  sort?: {};
}
