import { envVariables } from '../validation/env-variables';

export const cloudinaryConfig = {
  CLOUD_NAME: envVariables.CLOUDINARY_CLOUD_NAME,
  API_KEY: envVariables.CLOUDINARY_API_KEY,
  API_SECRET: envVariables.CLOUDINARY_API_SECRET,
};
