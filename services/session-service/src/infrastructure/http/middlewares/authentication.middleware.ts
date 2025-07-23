import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { UnauthorizedException } from '@/application/exceptions/unauthorised.execption';
import { validateToken } from '@/shared/utils/jwt.util';
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
    const user = new AuthenticatedUserDto(
      payload.id,
      payload.name,
      payload.email,
      payload.roles,
    );
    return { user };
  },
);
