import { jwtVerify, createRemoteJWKSet } from 'jose';
import type { JwtPayload } from '@/infrastructure/http/interfaces/jwt-payload';
import { jwtConfig } from '../config/jwt.config';

export async function validateToken(token: string) {
  const JWKS = createRemoteJWKSet(new URL(jwtConfig.JWKS_URL));
  const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
    issuer: jwtConfig.JWT_ISS,
    audience: jwtConfig.JWT_AUD,
  });
  return payload;
}
