import { NotFoundException } from '@/application/exceptions/not-found.exception';
import type { IFileStorageGateway } from '@/application/ports/file-storage.gateway';
import {
  Asset,
  type MediaSource,
  type ResourceType,
} from '@/domain/entity/asset.entity';
import { cloudinaryConfig } from '@/shared/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

export type CloudinaryUploadResponseType = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  playback_url: string;
  asset_folder: string;
  display_name: string;
  audio?: {
    codec: string;
    bit_rate: string;
    frequency: number;
    channels: number;
    channel_layout: string;
  };
  video?: {
    pix_format: string;
    codec: string;
    level: number;
    profile: string;
    bit_rate: string;
    dar: string;
    time_base: string;
  };
  is_audio?: boolean;
  frame_rate?: number;
  bit_rate?: number;
  duration?: number;
  rotation?: number;
  original_filename: string;
  nb_frames?: number;
  api_key: string;
};

export class CloudinaryService implements IFileStorageGateway {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryConfig.CLOUD_NAME,
      api_key: cloudinaryConfig.API_KEY,
      api_secret: cloudinaryConfig.API_SECRET,
    });
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

  async verifyAssetExists(
    key: string,
    resourceType: ResourceType,
  ): Promise<{
    exists: boolean;
    originalFilename: string;
    additionalMetadata?: Record<string, any>;
    resourceType: ResourceType;
    mediaSource?: MediaSource | null;
  }> {
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

  // deleteAsset(
  //   providerSpecificId: string,
  //   resourceType: ResourceType,
  //   accessType: AccessType,
  // ): Promise<{ success: boolean }> {
  //   throw new Error('Method not implemented.');
  // }
}
