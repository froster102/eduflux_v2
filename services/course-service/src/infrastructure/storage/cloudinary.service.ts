import {
  IFileStorageGateway,
  IUploadCredentialsOptions,
  IUploadCredentialsResponse,
} from '@/application/ports/file-storage.gateway';
import { Asset } from '@/domain/entity/asset.entity';
import { cloudinaryConfig } from '@/shared/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService implements IFileStorageGateway {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryConfig.CLOUD_NAME,
      api_key: cloudinaryConfig.API_KEY,
      api_secret: cloudinaryConfig.API_SECRET,
    });
  }
  getUploadCredentials(
    options: IUploadCredentialsOptions,
  ): IUploadCredentialsResponse {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign: Record<string, any> = {
      timestamp,
      public_id: options.assetId,
      folder: options.folderPath,
      type: options.accessType === 'private' ? 'authenticated' : 'upload',
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinaryConfig.API_SECRET,
    );

    let uploadEnpoint: string;

    switch (options.resourceType) {
      case 'image': {
        uploadEnpoint = 'image/upload';
        break;
      }
      case 'video': {
        uploadEnpoint = 'video/upload';
        break;
      }
      case 'raw': {
        uploadEnpoint = 'raw/upload';
        break;
      }
      default: {
        uploadEnpoint = 'raw/upload';
      }
    }

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.CLOUD_NAME}/${uploadEnpoint}`,
      uploadParams: {
        api_key: cloudinaryConfig.API_KEY,
        timestamp,
        signature,
        public_id: options.assetId,
        type: options.accessType === 'private' ? 'authenticated' : 'upload',
        folder: options.folderPath,
      },
      providerSpecificAssetId: options.providerSpecificId,
    };
  }

  getAccessUrl(
    asset: Asset,
    transformationOptions?: Record<string, any>,
    expiresInSeconds?: number,
  ): string {
    if (asset.provider !== 'cloudinary' || !asset.providerSpecificId) {
      throw new Error(
        `Invalid Asset for Cloudinary: missing provider-specific ID or incorrect provider.`,
      );
    }
    const options: Record<string, any> = {
      secure: true,
      resource_type: asset.resourceType,
      sign_url: asset.accessType === 'private',
      expires_at:
        asset.accessType === 'private'
          ? Math.floor(Date.now() / 1000) + (expiresInSeconds || 0)
          : undefined,
      type: asset.accessType === 'private' ? 'private' : 'upload',
      ...transformationOptions,
    };
    return cloudinary.url(asset.providerSpecificId, options);
  }

  verifyWebhookSignature(options: {
    signature: string;
    timestamp: string;
    payload: Record<string, any>;
  }): boolean {
    const paredTimestamp = parseInt(options.timestamp, 10);

    const isVerified = cloudinary.utils.verifyNotificationSignature(
      JSON.stringify(options.payload),
      paredTimestamp,
      options.signature,
    );

    return isVerified;
  }

  // verifyAssetExists(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{
  //   exists: boolean;
  //   duration?: number;
  //   originalFilename?: string;
  //   additionalMetadata?: Record<string, any>;
  // }> {
  //   throw new Error('Method not implemented.');
  // }

  // deleteAsset(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{ success: boolean }> {
  //   throw new Error('Method not implemented.');
  // }
}
