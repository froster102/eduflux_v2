import { StorageProvider } from '@core/domain/asset/enum/StorageProvider';
import { AccessType } from '@core/domain/asset/enum/AccessType';
import { ResourceType } from '@core/domain/asset/enum/ResourceType';

export interface MediaSource {
  type: string;
  src: string;
}

export interface CreateAssetPayload {
  provider: StorageProvider;
  providerSpecificId: string;
  accessType: AccessType;
  mediaSources: MediaSource[];
  resourceType?: ResourceType;
  originalFileName?: string;
}
