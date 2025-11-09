import { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import { UnauthorizedException } from '@eduflux-v2/shared/exceptions/UnauthorizedException';
import Elysia from 'elysia';
import { validateToken } from '@eduflux-v2/shared/utils/jwtUtil';
import { checkIfUserIsBlocked } from '@eduflux-v2/shared/utils/blockedUserChecker';
import { container } from '@di/RootModule';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';
import type { CacheClientPort } from '@eduflux-v2/shared/ports/cache/CacheClientPort';
import { JwtConfig } from '@shared/config/JwtConfig';

export const authenticaionMiddleware = new Elysia().derive(
  { as: 'global' },
  async ({ cookie }) => {
    const token = cookie?.user_jwt.value as string;
    if (!token) {
      throw new UnauthorizedException('Authentication Token Not Found');
    }
    const payload = await validateToken(token, JwtConfig).catch(() => {
      throw new UnauthorizedException(
        'Invalid token or token has been expired',
      );
    });

    const cacheClient = container.get<CacheClientPort>(
      SharedInfrastructureDITokens.CacheClient,
    );
    await checkIfUserIsBlocked(payload.id, cacheClient);

    const user = new AuthenticatedUserDto(
      payload.id,
      payload.name,
      payload.email,
      payload.roles,
    );
    return { user };
  },
);
