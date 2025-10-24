import type { TaughtCourseView } from '@core/application/views/taught-course/entity/TaughtCourseView';
import type { TaughtCourseViewQueryParameters } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryParameters';
import type { TaughtCourseViewQueryResult } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { TaughtCourseViewUpsertPayload } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewUpsertPayload';
import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';

export interface TaughtCourseViewRepositoryPort
  extends BaseRepositoryPort<TaughtCourseView> {
  upsert(payload: TaughtCourseViewUpsertPayload): Promise<void>;
  findByUserId(
    userId: string,
    query?: TaughtCourseViewQueryParameters,
  ): Promise<TaughtCourseViewQueryResult>;
}
