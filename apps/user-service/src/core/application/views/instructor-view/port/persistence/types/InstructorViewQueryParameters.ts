import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export type InstructorViewQueryParameters = {
  filter: {
    isSchedulingEnabled: boolean;
  };
} & PaginationQueryParams;
