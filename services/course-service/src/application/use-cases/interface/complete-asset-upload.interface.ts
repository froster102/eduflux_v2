import {
  Asset,
  type MediaSource,
  type ResourceType,
} from '@/domain/entity/asset.entity';
import type { IUseCase } from './use-case.interface';

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
