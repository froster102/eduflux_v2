import type { PaginationQueryParams } from '@core/common/port/persistence/type/QueryParameters';

export interface MessageQueryParameters extends PaginationQueryParams {
  before?: string;
}
