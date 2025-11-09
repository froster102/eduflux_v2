import type { JwtConfig } from '@shared/config/JwtConfig';
import type { JwtPayload } from '@shared/types/JwtPayload';
import { jwtVerify, createRemoteJWKSet } from 'jose';

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

export async function validateToken(token: string, config: JwtConfig) {
  if (!JWKS) {
    JWKS = createRemoteJWKSet(new URL(config.JWKS_URL));
  }

  const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
    issuer: config.JWT_ISS,
    audience: config.JWT_AUD,
  });
  return payload;
}
