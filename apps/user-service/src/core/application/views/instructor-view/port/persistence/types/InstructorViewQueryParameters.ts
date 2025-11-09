import type { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export type InstructorViewQueryParameters = {
  filter: {
    isSchedulingEnabled: boolean;
    name?: string;
    sort?: Record<string, SortOrder>;
  };
} & PaginationQueryParams;
