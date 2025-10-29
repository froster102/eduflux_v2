import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import type { ResourceType } from '@core/domain/asset/enum/ResourceType';

export interface AddAssetToLecturePort {
  courseId: string;
  lectureId: string;
  key: string;
  resourceType: ResourceType;
  fileName: string;
  uuid: string;
  actor: AuthenticatedUserDto;
}
