import type { InstructorViewQueryResult } from "@core/application/instructor-view/port/persistence/types/GetInstructorViewQueryResult";
import type { InstructorViewQueryParameters } from "@core/application/instructor-view/port/persistence/types/InstructorViewQueryParameters";
import type { UpdateUserPayload } from "@core/common/port/persistence/types/UpdateUserPayload";
import type { BaseRepositoryPort } from "@core/common/port/persistence/BaseRepositoryPort";
import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";

export type UpsertPayload = {
  [key: string]: any;
};

export interface InstructorViewRepositoryPort
  extends BaseRepositoryPort<InstructorView> {
  upsert(id: string, payload: UpsertPayload): Promise<InstructorView>;
  updateUser(id: string, payload: UpdateUserPayload): Promise<void>;
  findInstructors(
    queryParameters: InstructorViewQueryParameters,
    excludeId?: string,
  ): Promise<InstructorViewQueryResult>;
}
