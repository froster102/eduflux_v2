import type { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';
import type { SubscribedCourseViewQueryParameters } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';
import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { SubscribedCourseViewUpsertPayload } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUpsertPayload';
import type { SubscribedCourseViewUserUpdatePayload } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUserUpdatePayload';
import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';

export interface SubscribedCourseViewRepositoryPort
  extends BaseRepositoryPort<SubscribedCourseView> {
  upsert(payload: SubscribedCourseViewUpsertPayload): Promise<void>;
  updateUser(payload: SubscribedCourseViewUserUpdatePayload): Promise<void>;
  findByUserId(
    userId: string,
    query?: SubscribedCourseViewQueryParameters,
  ): Promise<SubscribedCourseViewQueryResult>;
}
