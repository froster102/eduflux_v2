import {
  Asset,
  type MediaSource,
  type ResourceType,
} from '@/domain/entity/asset.entity';

export interface IFileStorageGateway {
  getAccessUrl(
    assetData: Asset,
    transformationOptions?: Record<string, any>,
    expiresInSeconds?: number,
  ): string;

  verifyWebhookSignature(options: {
    signature: string;
    timestamp: string;
    payload: Record<string, any>;
  }): boolean;

  verifyAssetExists(
    key: string,
    resourceType: ResourceType,
  ): Promise<{
    exists: boolean;
    originalFilename: string;
    additionalMetadata?: Record<string, any>;
    mediaSource?: MediaSource | null;
    resourceType: ResourceType;
  }>;

  // deleteAsset(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{ success: boolean }>;
}
