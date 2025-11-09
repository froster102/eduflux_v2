import { cloudinaryConfig } from '@/shared/config/cloudinaryConfig';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
  api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface IUploadCredentialsOptions {
  fileName: string;
  contentType: string;
  folderPath?: string;
  size?: number;
  expiresInSeconds?: number;
  metadata?: { [key: string]: string | number | boolean | string[] };
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  uploadPreset?: string;
  useFilename?: boolean;
}

export interface IUploadCredentials {
  uploadUrl: string;
  formFields: { [key: string]: string };
  fileKey: string;
  expiresAt?: string;
}

export const generateCloudinaryUploadCredentials = (
  options: IUploadCredentialsOptions,
): IUploadCredentials => {
  const {
    fileName,
    folderPath,
    expiresInSeconds = cloudinaryConfig.CLOUDINARY_DEFAULT_SIGNATURE_EXPIRES_IN_SECONDS,
    metadata = {},
    resourceType = 'auto',
    uploadPreset,
    useFilename = false,
  } = options;

  let publicId: string | undefined;

  if (useFilename) {
    publicId = path.parse(fileName).name;
  } else {
    publicId = `${folderPath ? folderPath + '/' : ''}${uuidv4()}`;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign: { [key: string]: any } = {
    timestamp: timestamp,
    ...metadata,
  };

  if (folderPath) {
    paramsToSign.folder = folderPath;
  }
  if (publicId) {
    paramsToSign.public_id = publicId;
  }
  if (uploadPreset) {
    paramsToSign.upload_preset = uploadPreset;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinaryConfig.CLOUDINARY_API_SECRET,
  );

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const formFields: { [key: string]: string } = {
    ...Object.entries(paramsToSign).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.join(',');
        } else if (typeof value === 'object' && value !== null) {
          acc[key] = JSON.stringify(value);
        } else {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as { [key: string]: string },
    ),
    api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
    signature: signature,
  };

  const expiresAt = new Date(
    Date.now() + expiresInSeconds * 1000,
  ).toISOString();

  return {
    uploadUrl: uploadUrl,
    formFields: formFields,
    fileKey: publicId,
    expiresAt: expiresAt,
  };
};
