import type { MediaSource } from '@core/domain/asset/entity/types/CreateAssetPayload';
import type { ResourceType } from '@core/domain/asset/enum/ResourceType';

export interface CompleteAssetUploadPort {
  providerSpecificId: string;
  originalFileName: string;
  duration: number | null;
  additionalMetadata: Record<string, any>;
  mediaSource: MediaSource;
  resourseType: ResourceType;
}
