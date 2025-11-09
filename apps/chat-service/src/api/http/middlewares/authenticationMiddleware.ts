import { UnauthorizedException } from '@eduflux-v2/shared/exceptions/UnauthorizedException';
import type { JwtPayload } from '@eduflux-v2/shared/types/JwtPayload';
import { validateToken } from '@eduflux-v2/shared/utils/jwtUtil';
import { checkIfUserIsBlocked } from '@eduflux-v2/shared/utils/blockedUserChecker';
import { container } from '@di/RootModule';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import type { CacheClientPort } from '@eduflux-v2/shared/ports/cache/CacheClientPort';
import { JwtConfig } from '@shared/config/JwtConfig';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

export type Env = {
  Variables: {
    user: JwtPayload;
  };
};

export const authenticaionMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const token = getCookie(c, 'user_jwt');
    if (!token) {
      throw new UnauthorizedException('Authentication Token Not Found');
    }
    const payload = await validateToken(token, JwtConfig).catch(() => {
      throw new UnauthorizedException('Invalid token');
    });

    const cacheClient = container.get<CacheClientPort>(
      SharedInfrastructureDITokens.CacheClient,
    );
    await checkIfUserIsBlocked(payload.id, cacheClient);

    c.set('user', payload);
    await next();
  },
);
