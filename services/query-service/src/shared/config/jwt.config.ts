import { envVariables } from "../validation/env-variables";

export const jwtConfig = {
  JWT_ISS: envVariables.JWT_ISS,
  JWT_AUD: envVariables.JWT_AUD,
  JWKS_URL: envVariables.JWKS_URL,
};
