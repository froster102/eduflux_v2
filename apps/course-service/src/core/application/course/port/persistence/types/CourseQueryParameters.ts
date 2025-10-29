import type { SortOrder } from '@core/domain/common/enum/SortOrder';
import type { PaginationQueryParams as QueryParameters } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import type { CourseStatus } from '@core/domain/course/enum/CourseStatus';

export interface CourseQueryParameters extends QueryParameters {
  filters?: {
    status?: CourseStatus;
    catergory?: string;
    instructor?: string;
  };
  sort?: {
    price?: SortOrder;
  };
}
