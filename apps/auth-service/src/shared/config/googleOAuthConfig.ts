import { envVariables } from '../env/env-variables';

export const googleOAuthConfig = {
  GOOGLE_CLIENT_ID: envVariables.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: envVariables.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: envVariables.REDIRECT_URI,
};
