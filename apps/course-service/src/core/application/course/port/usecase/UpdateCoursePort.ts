import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import type { UpdateCourseDetailsPayload } from '@core/domain/course/entity/types/UpdateCourseDetailsPayload';

export interface UpdateCoursePort {
  courseId: string;
  updates: UpdateCourseDetailsPayload;
  actor: AuthenticatedUserDto;
}
