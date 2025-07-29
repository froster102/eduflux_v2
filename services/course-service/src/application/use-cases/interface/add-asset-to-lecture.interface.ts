import { ResourceType } from '@/domain/entity/asset.entity';
import { IUseCase } from './use-case.interface';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';

export interface AddAssetToLectureInput {
  courseId: string;
  lectureId: string;
  key: string;
  resourceType: ResourceType;
  fileName: string;
  uuid: string;
  actor: AuthenticatedUserDto;
}

export interface IAddAssetToLectureUseCase
  extends IUseCase<AddAssetToLectureInput, void> {}
