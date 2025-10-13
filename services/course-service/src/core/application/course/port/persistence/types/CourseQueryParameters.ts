import type { SortOrder } from '@core/common/enums/SortOrder';
import type { QueryParameters } from '@core/common/port/persistence/types/QueryParameters';
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
