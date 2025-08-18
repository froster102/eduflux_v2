import type {
  AccessType,
  MediaSource,
  MediaStatus,
  StorageProvider,
} from '@/domain/entity/asset.entity';
import type { ResourceType } from 'cloudinary';

export interface AssetDto {
  _class: ClassType;
  id: string;
  provider: StorageProvider;
  providerSpecificId: string | null;
  resourceType: ResourceType | null;
  accessType: AccessType;
  originalFileName: string | null;
  duration: number | null;
  status: MediaStatus;
  mediaSources: MediaSource[];
  additionalMetadata: Record<string, any> | null;
}
