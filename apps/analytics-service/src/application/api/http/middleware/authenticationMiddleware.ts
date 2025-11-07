import { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import { UnauthorizedException } from '@eduflux-v2/shared/exceptions/UnauthorizedException';
import { validateToken } from '@eduflux-v2/shared/utils/jwtUtil';
import { JwtConfig } from '@shared/config/JwtConfig';
import Elysia from 'elysia';

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
    const user = new AuthenticatedUserDto(
      payload.id,
      payload.name,
      payload.email,
      payload.roles,
    );
    return { user };
  },
);
