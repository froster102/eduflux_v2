import 'dotenv/config';

export const jwtConfig = {
  JWT_ISS: process.env.JWT_ISS,
  JWT_AUD: process.env.JWT_AUD,
  JWKS_URL: process.env.JWKS_URL,
};
