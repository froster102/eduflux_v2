import { StorageProvider } from '@core/domain/asset/enum/StorageProvider';
import { AccessType } from '@core/domain/asset/enum/AccessType';
import { ResourceType } from '@core/domain/asset/enum/ResourceType';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { MediaSource } from './CreateAssetPayload';

export interface NewAssetPayload {
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
