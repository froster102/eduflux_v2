import type { SubscribedCourseView } from '@application/views/subscribed-course/entity/SubscribedCourseView';
import type { SubscribedCourseViewQueryParameters } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';
import type { SubscribedCourseViewQueryResult } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { SubscribedCourseViewUpsertPayload } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUpsertPayload';
import type { SubscribedCourseViewUserUpdatePayload } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUserUpdatePayload';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';

export interface SubscribedCourseViewRepositoryPort
  extends BaseRepositoryPort<SubscribedCourseView> {
  upsert(payload: SubscribedCourseViewUpsertPayload): Promise<void>;
  updateUser(payload: SubscribedCourseViewUserUpdatePayload): Promise<void>;
  findByUserId(
    userId: string,
    query?: SubscribedCourseViewQueryParameters,
  ): Promise<SubscribedCourseViewQueryResult>;
}
