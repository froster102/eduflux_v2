import type { PaginationQueryParams as QueryParameters } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import type { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import type { CourseLevel } from '@eduflux-v2/shared/constants/CourseLevel';
import type { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';

export interface CourseQueryParameters extends QueryParameters {
  filters?: {
    status?: CourseStatus;
    catergory?: string;
    instructor?: string;
    level?: CourseLevel;
    title?: string;
    sort?: Record<string, SortOrder>;
  };
}
