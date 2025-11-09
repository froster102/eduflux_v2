import type { TaughtCourseView } from '@application/views/taught-course/entity/TaughtCourseView';
import type { TaughtCourseViewQueryParameters } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryParameters';
import type { TaughtCourseViewQueryResult } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { TaughtCourseViewUpsertPayload } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewUpsertPayload';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';

export interface TaughtCourseViewRepositoryPort
  extends BaseRepositoryPort<TaughtCourseView> {
  upsert(payload: TaughtCourseViewUpsertPayload): Promise<void>;
  findByUserId(
    userId: string,
    query?: TaughtCourseViewQueryParameters,
  ): Promise<TaughtCourseViewQueryResult>;
}
