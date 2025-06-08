import { jwtVerify, createRemoteJWKSet } from 'jose';
import { jwtConfig } from '../config/jwt.config';
import { JwtPayload } from '@/infrastructure/http/interfaces/jwt-payload';

export async function validateToken(token: string) {
  const JWKS = createRemoteJWKSet(new URL(jwtConfig.JWKS_URL));
  const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
    issuer: jwtConfig.JWT_ISS,
    audience: jwtConfig.JWT_AUD,
  });
  return payload;
}
