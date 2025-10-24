import { envVariables } from '@shared/env/env-variables';

export const cloudinaryConfig = {
  CLOUD_NAME: envVariables.CLOUDINARY_CLOUD_NAME,
  API_KEY: envVariables.CLOUDINARY_API_KEY,
  API_SECRET: envVariables.CLOUDINARY_API_SECRET,
};

export class CloudinaryConfig {
  static readonly CLOUD_NAME = envVariables.CLOUDINARY_CLOUD_NAME;
  static readonly API_KEY = envVariables.CLOUDINARY_API_KEY;
  static readonly API_SECRET = envVariables.CLOUDINARY_API_SECRET;
}
