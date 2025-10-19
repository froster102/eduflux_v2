import type { AuthenticatedUserDto } from '@shared/common/dto/AuthenticatedUserDto';
import { UnauthorizedException } from '@shared/common/exception/UnauthorizedException';
import { validateToken } from '@shared/utils/jwt.util';
import Elysia from 'elysia';

export const authenticaionMiddleware = new Elysia().derive(
  { as: 'global' },
  async ({ cookie }) => {
    const token = cookie?.user_jwt.value;
    if (!token) {
      throw new UnauthorizedException('Authentication Token Not Found');
    }
    const payload = await validateToken(token).catch(() => {
      throw new UnauthorizedException(
        'Invalid token or token has been expired',
      );
    });
    const user: AuthenticatedUserDto = {
      id: payload.id,
      roles: payload.roles,
      hasRole: (role) => payload.roles.includes(role),
    };
    return { user };
  },
);
