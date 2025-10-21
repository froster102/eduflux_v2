import { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedDto';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { validateToken } from '@shared/utils/JwtUtil';
import Elysia from 'elysia';

export const authenticaionMiddleware = new Elysia().derive(
  { as: 'global' },
  async ({ cookie }) => {
    const token = cookie?.user_jwt.value;
    if (!token) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'Authentication Token Not Found',
      });
    }
    const payload = await validateToken(token).catch(() => {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: 'Invalid token or token has been expired',
      });
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
