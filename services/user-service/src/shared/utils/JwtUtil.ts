import type { JwtPayload } from '@application/api/http-rest/interface/JwtPayload';
import { JwtConfig } from '@infrastructure/config/JwtConfig';
import { jwtVerify, createRemoteJWKSet } from 'jose';

export class JwtUtil {
  static async validateToken(token: string) {
    const JWKS = createRemoteJWKSet(new URL(JwtConfig.JWKS_URL));
    const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
      issuer: JwtConfig.JWT_ISS,
      audience: JwtConfig.JWT_AUD,
    });
    return payload;
  }
}
