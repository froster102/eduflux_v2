import { v2 as cloudinary } from 'cloudinary';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CloudinaryConfig } from '@shared/config/CloudinaryConfig';
import type {
  FileStorageGatewayPort,
  VerifyAssetResult,
} from '@core/application/course/port/gateway/FileStorageGatewayPort';
import type { ResourceType } from '@core/domain/asset/enum/ResourceType';
import type { CloudinaryUploadResponseType } from '@infrastructure/adapter/storage/types/CloudinaryUploadResponseType';

export class CloudinaryFileStorageAdapter implements FileStorageGatewayPort {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.CLOUD_NAME,
      api_key: CloudinaryConfig.API_KEY,
      api_secret: CloudinaryConfig.API_SECRET,
    });
  }

  async deleteFile(publicId: string, resourceType: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }

  getAccessUrl(
    publicId: string,
    resourceType: string,
    accessType: 'public' | 'private',
    transformationOptions?: Record<string, any>,
    expiresInSeconds?: number,
  ): string {
    const options: Record<string, any> = {
      secure: true,
      resource_type: resourceType,
      sign_url: accessType === 'private',
      expires_at:
        accessType === 'private'
          ? Math.floor(Date.now() / 1000) + (expiresInSeconds || 0)
          : undefined,
      type: accessType === 'private' ? 'private' : 'upload',
      ...transformationOptions,
    };

    return cloudinary.url(publicId, options);
  }

  async verifyAssetExists(
    key: string,
    resourceType: ResourceType,
  ): Promise<VerifyAssetResult> {
    try {
      const result = (await cloudinary.uploader.explicit(key.split('.')[0], {
        resource_type: resourceType,
        type: 'upload',
      })) as CloudinaryUploadResponseType;
      return {
        exists: true,
        originalFilename: result.original_filename,
        resourceType: result.resource_type as ResourceType,
        mediaSource:
          result.resource_type === 'video'
            ? {
                type: 'application/x-mpegURL',
                src: result.playback_url,
              }
            : null,
      };
    } catch {
      throw new NotFoundException(`Asset not found.`);
    }
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
}
