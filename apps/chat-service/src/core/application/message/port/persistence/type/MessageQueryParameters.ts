import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface MessageQueryParameters extends PaginationQueryParams {
  before?: string;
}
