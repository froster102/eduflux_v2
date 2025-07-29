import { Asset, MediaSource, ResourceType } from '@/domain/entity/asset.entity';
import { IUseCase } from './use-case.interface';

export interface CompleteAssetUploadDto {
  providerSpecificId: string;
  originalFileName: string;
  duration: number | null;
  additionalMetadata: Record<string, any>;
  mediaSource: MediaSource;
  resourseType: ResourceType;
}

export interface ICompleteAssetUploadUseCase
  extends IUseCase<CompleteAssetUploadDto, Asset> {}
