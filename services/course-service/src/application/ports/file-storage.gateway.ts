import { AccessType, Asset, ResourceType } from '@/domain/entity/asset.entity';

export interface IUploadCredentialsOptions {
  providerSpecificId: string;
  assetId: string;
  accessType: AccessType;
  folderPath: string;
  resourceType: ResourceType;
}

export interface IUploadCredentialsResponse {
  uploadUrl: string;
  uploadParams: Record<string, any>;
  providerSpecificAssetId: string;
}

export interface IFileStorageGateway {
  getUploadCredentials(
    options: IUploadCredentialsOptions,
  ): IUploadCredentialsResponse;

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

  // verifyAssetExists(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{
  //   exists: boolean;
  //   duration?: number;
  //   originalFilename?: string;
  //   additionalMetadata?: Record<string, any>;
  // }>;

  // deleteAsset(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{ success: boolean }>;
}
