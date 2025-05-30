import { betterAuth } from 'better-auth';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/infrastructure/database/db';
import * as schema from '@/infrastructure/database/schema';
import { signUpSchema } from '@/infrastructure/validation/sign-up.schema';
import { emailOTP, jwt } from 'better-auth/plugins';
import { NodeMailerService } from '@/infrastructure/external/nodemailer.service';
import { betterAuthConfig } from '@/shared/config/better-auth.config';
import { googleOAuthConfig } from '@/shared/config/googleOAuth.config';

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
        defaultValue: ['STUDENT'],
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
    // eslint-disable-next-line @typescript-eslint/require-await
    before: createAuthMiddleware(async (ctx) => {
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
    }),

    // eslint-disable-next-line @typescript-eslint/require-await
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-in/email') {
        const newSession = ctx.context.newSession;
        const returned = ctx.context.returned as Record<string, any>;
        if (returned.user) {
          return {
            ...returned,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            user: {
              ...returned.user,
              roles: newSession.user.roles as string[],
            },
          };
        }
        return returned;
      }
    }),
  },
  trustedOrigins: ['http://localhost:5173'],
  plugins: [
    emailOTP({
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          const nodemailer = new NodeMailerService();
          await nodemailer.sendEmail(
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
          const nodemailer = new NodeMailerService();
          await nodemailer.sendEmail(
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
        definePayload: ({ user, session }) => ({
          ...user,
          sessionId: session.id,
        }),
      },
    }),
  ],
});
