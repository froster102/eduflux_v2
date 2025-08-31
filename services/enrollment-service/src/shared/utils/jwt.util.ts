import { JwtConfig } from '@shared/config/JwtConfig';
import { jwtVerify, createRemoteJWKSet } from 'jose';

export async function validateToken(token: string) {
  const JWKS = createRemoteJWKSet(new URL(JwtConfig.JWKS_URL));
  const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
    issuer: JwtConfig.JWT_ISS,
    audience: JwtConfig.JWT_AUD,
  });
  return payload;
}
