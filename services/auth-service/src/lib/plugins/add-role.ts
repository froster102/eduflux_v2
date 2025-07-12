import { db } from '@/database/db';
import { user } from '@/database/schema';
import { IUserGrpcService } from '@/interfaces/user-service.grpc.interface';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import {
  APIError,
  createAuthEndpoint,
  sessionMiddleware,
} from 'better-auth/api';
import { getJwtToken } from 'better-auth/plugins';
import { BetterAuthPlugin } from 'better-auth/types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export interface AddRoleOptions {
  role: 'INSTRUCTOR';
  allowUserToAddRole: boolean;
}

export const addRole = () => {
  return {
    id: 'add-role',
    endpoints: {
      addRole: createAuthEndpoint(
        '/users/me/roles',
        {
          method: 'POST',
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;
          if (!session) {
            throw new APIError('UNAUTHORIZED', {
              code: 'UNAUTHORIZED',
              message: 'User is not authrorized for this action',
            });
          }

          const roleSchema = z.object({
            role: z.enum(['INSTRUCTOR']),
          });

          const result = roleSchema.safeParse(ctx.body);

          if (result.error) {
            throw new APIError('BAD_REQUEST', {
              code: 'VALIDATION_ERROR',
              message: 'Invalid role',
            });
          }

          const foundUser = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
          });

          if (foundUser.roles.includes(result.data.role)) {
            throw new APIError('BAD_REQUEST', {
              code: 'ROLE_ALREADY_EXISTS',
              message: 'Role already exists for the user',
            });
          }

          const userService = container.get<IUserGrpcService>(
            TYPES.UserGrpcService,
          );

          const updatedUser = await db.transaction(async (tx) => {
            const [updatedUser] = await tx
              .update(user)
              .set({ roles: [...foundUser.roles, result.data.role] })
              .where(eq(user.id, session.user.id))
              .returning();
            await userService.updateUser({
              id: foundUser.id,
              roles: [...(foundUser.roles as Role[]), 'INSTRUCTOR'],
            });
            return updatedUser;
          });

          const jwtToken = await getJwtToken(ctx, {
            jwt: {
              issuer: process.env.JWT_ISS,
              audience: process.env.JWT_AUD,
              definePayload() {
                return {
                  ...updatedUser,
                  sessionId: session.session.id,
                };
              },
              getSubject: () => session.user.id,
            },
          });
          ctx.setCookie('user_jwt', jwtToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/',
          });

          return ctx.json({
            user: updatedUser,
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};
