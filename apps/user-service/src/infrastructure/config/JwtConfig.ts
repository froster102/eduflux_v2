import { envVariables } from '@shared/validation/env-variables';

export class JwtConfig {
  static JWT_ISS = envVariables.JWT_ISS;
  static JWT_AUD = envVariables.JWT_AUD;
  static JWKS_URL = envVariables.JWKS_URL;
}
