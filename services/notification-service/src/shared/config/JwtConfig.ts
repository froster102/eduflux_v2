import { envVariables } from "@shared/env/envVariables";

export class JwtConfig {
  static readonly JWT_ISS = envVariables.JWT_ISS;
  static readonly JWT_AUD = envVariables.JWT_AUD;
  static readonly JWKS_URL = envVariables.JWKS_URL;
}
