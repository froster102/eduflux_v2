import 'dotenv/config';

export const googleOAuthConfig = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
};
