import { JwtConfig } from "@shared/config/JwtConfig";
import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(new URL(JwtConfig.JWKS_URL));
export async function validateToken(token: string) {
  const { payload } = await jwtVerify<JwtPayload>(token, JWKS, {
    issuer: JwtConfig.JWT_ISS,
    audience: JwtConfig.JWT_AUD,
  });
  return payload;
}
