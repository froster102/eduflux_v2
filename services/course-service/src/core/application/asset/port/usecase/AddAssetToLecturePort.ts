import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';
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
