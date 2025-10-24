import type { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';
import type { InstructorViewQueryResult } from '@core/application/views/instructor-view/port/persistence/types/GetInstructorViewQueryResult';
import type { InstructorViewQueryParameters } from '@core/application/views/instructor-view/port/persistence/types/InstructorViewQueryParameters';
import type { UpdateUserViewPayload } from '@core/application/views/instructor-view/port/persistence/types/UpdateUserViewPayload';
import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';

export type UpsertPayload = {
  [key: string]: any;
};

export interface InstructorViewRepositoryPort
  extends BaseRepositoryPort<InstructorView> {
  upsert(id: string, payload: UpsertPayload): Promise<InstructorView>;
  updateUser(id: string, payload: UpdateUserViewPayload): Promise<void>;
  findInstructors(
    queryParameters: InstructorViewQueryParameters,
    excludeId?: string,
  ): Promise<InstructorViewQueryResult>;
  incrementCompletedSessions(instructorId: string): Promise<void>;
}
