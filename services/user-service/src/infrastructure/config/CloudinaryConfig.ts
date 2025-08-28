import { envVariables } from 'src/shared/validation/env-variables';

export class CloudinaryConfig {
  static CLOUD_NAME = envVariables.CLOUDINARY_CLOUD_NAME;
  static API_KEY = envVariables.CLOUDINARY_API_KEY;
  static API_SECRET = envVariables.CLOUDINARY_API_SECRET;
}
