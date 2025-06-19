import 'dotenv/config';

export const cloudinaryConfig = {
  CLOUD_NAME: process.env.CLOUD_NAME as string,
  API_KEY: process.env.API_KEY as string,
  API_SECRET: process.env.API_SECRET as string,
};
