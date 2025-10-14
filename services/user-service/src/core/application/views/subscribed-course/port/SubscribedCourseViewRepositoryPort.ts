import type { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';
import type { SubscribedCourseViewQueryParameters } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';
import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';

export interface SubscribedCourseViewRepositoryPort
  extends BaseRepositoryPort<SubscribedCourseView> {
  upsert(subscribedCourseView: SubscribedCourseView): Promise<void>;
  findByUserId(
    userId: string,
    query?: SubscribedCourseViewQueryParameters,
  ): Promise<SubscribedCourseViewQueryResult>;
}
