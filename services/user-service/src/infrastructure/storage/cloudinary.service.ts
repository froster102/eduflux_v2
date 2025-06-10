import {
  IFileStorageService,
  ISignedUploadUrlResponse,
} from '@/application/ports/file-storage.service';
import { cloudinaryConfig } from '@/shared/config/cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService implements IFileStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: cloudinaryConfig.CLOUD_NAME,
      api_key: cloudinaryConfig.API_KEY,
      api_secret: cloudinaryConfig.API_SECRET,
    });
  }

  createSignedUploadUrl(options?: {
    folder?: string;
    publicId?: string;
  }): ISignedUploadUrlResponse {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: options.publicId,
        upload_preset: 'profile-image',
      },
      cloudinaryConfig.API_SECRET,
    );
    return {
      apiKey: cloudinaryConfig.API_KEY,
      cloudName: cloudinaryConfig.CLOUD_NAME,
      signature,
      timestamp,
      publicId: options.publicId,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.CLOUD_NAME}/image/upload`,
    };
  }
}
