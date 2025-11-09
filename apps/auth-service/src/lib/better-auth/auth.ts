import * as schema from '@/database/schema';
import { betterAuthConfig } from '@/shared/config/betterAuthConfig';
import { googleOAuthConfig } from '@/shared/config/googleOAuthConfig';
import { db } from '@/database/db';
import { signUpSchema } from '@/http/validators/signUpSchema';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailService } from '@/services';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { envVariables } from '@/shared/env/env-variables';
import { betterAuth } from 'better-auth';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import type { GenericEndpointContext } from 'better-auth';
import { emailOTP, jwt, admin } from 'better-auth/plugins';
import { getJwtToken } from 'better-auth/plugins';
import { userService } from '@/grpc/grpcUserServiceAdapter';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { cacheClient } from '@/lib/cache/cacheClient';

export const auth = betterAuth({
  secret: betterAuthConfig.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  advanced: {
    cookiePrefix: 'eduflux',
  },
  user: {
    additionalFields: {
      roles: {
        type: 'string[]',
        required: true,
        defaultValue: [Role.LEARNER],
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'email-password'],
    },
  },
  socialProviders: {
    google: {
      clientId: googleOAuthConfig.GOOGLE_CLIENT_ID,
      clientSecret: googleOAuthConfig.GOOGLE_CLIENT_SECRET,
      prompt: 'consent',
      redirectURI: googleOAuthConfig.REDIRECT_URI,
      display: 'popup',
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx: GenericEndpointContext) => {
      if (ctx.path === '/sign-up/email') {
        const result = signUpSchema.safeParse(ctx.body);
        if (!result.success) {
          const errors = result.error.errors.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          }));
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid request',
            type: 'validation_error',
            errors,
          });
        }
      }
      return Promise.resolve();
    }),

    after: createAuthMiddleware(async (ctx: GenericEndpointContext) => {
      if (ctx.path === '/sign-in/email') {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const jwtToken = await getJwtToken(ctx, {
            jwt: {
              issuer: process.env.JWT_ISS,
              audience: process.env.JWT_AUD,
              definePayload() {
                return {
                  ...newSession.user,
                  sessionId: newSession.session.id,
                };
              },
              expirationTime: envVariables.JWT_EXP,
              getSubject: () => newSession.user.id,
            },
          });
          ctx.setCookie('user_jwt', jwtToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/',
          });
        }
        const returned = ctx.context.returned as Record<string, unknown>;
        if (returned.user) {
          return {
            ...returned,
            user: {
              ...(returned.user as Record<string, unknown>),
              roles: newSession!.user.roles as string[],
            },
          };
        }
        return returned;
      }
      if (ctx.path === '/sign-out') {
        ctx.setCookie('user_jwt', '', {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          path: '/',
          maxAge: 0,
        });
      }
      if (ctx.path === '/token') {
        const token = (ctx.context.returned as { token: string }).token;
        if (token) {
          ctx.setCookie('user_jwt', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/',
          });
        }
      }
      if (ctx.path === '/admin/ban-user') {
        await cacheClient.blockUser((ctx.body as { userId: string })?.userId);
      }
      if (ctx.path === '/admin/unban-user') {
        await cacheClient.unblockUser((ctx.body as { userId: string })?.userId);
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          if (user) {
            const [firstName, lastName] = user.name.split(' ');

            const { error } = await tryCatch(
              userService.createUser({
                id: user.id,
                firstName,
                lastName,
                email: user.email,
                roles: [Role.LEARNER],
              }),
            );

            if (error) {
              if (context) {
                await context.context.internalAdapter.deleteUser(user.id);
                throw new APIError('INTERNAL_SERVER_ERROR', {
                  message: 'Internal server error',
                });
              }
            }
          }
        },
      },
    },
  },
  trustedOrigins: ['http://localhost:5173'],
  plugins: [
    emailOTP({
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          await emailService.sendEmail(
            email,
            'Verification email',
            `Your otp to verify is ${otp}`,
          );
        }
        if (type === 'forget-password') {
          // const user = await db
          //   .select()
          //   .from(schema.user)
          //   .where(eq(schema.user.email, email));
          // if (!(user.length > 0)) {
          //   throw new APIError('BAD_REQUEST', { message: '' });
          // }
          await emailService.sendEmail(
            email,
            'Reset your password',
            `Your otp for resetting your password is ${otp}`,
          );
        }
      },
      otpLength: 4,
    }),
    jwt({
      jwt: {
        issuer: process.env.JWT_ISS,
        audience: process.env.JWT_AUD,
        definePayload: ({ user, session }) => ({
          ...user,
          sessionId: session.id,
        }),
        expirationTime: envVariables.JWT_EXP,
      },
    }),
    admin(),
  ],
});
