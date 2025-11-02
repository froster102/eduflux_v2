import { z } from 'zod/v4';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  HTTP_SERVER_PORT: z.coerce
    .number()
    .min(1000)
    .max(65535, 'HTTP_SERVER_PORT must be between 1000 and 65535'),

  AUTH_SERVICE_BASE_URL: z.string({
    error: 'AUTH_SERVICE_BASE_URL is required',
  }),
  USER_SERVICE_BASE_URL: z.string({
    error: 'GRPC_COURSE_SERVICE_URL is required',
  }),
  COURSE_SERVICE_BASE_URL: z.string({
    error: 'COURSE_SERVICE_BASE_URL is required',
  }),
  PAYMENT_SERVICE_BASE_URL: z.string({
    error: 'PAYMENT_SERVICE_BASE_URL is required',
  }),
  CHAT_SERVICE_BASE_URL: z.string({
    error: 'CHAT_SERVICE_BASE_URL is required',
  }),
  NOTIFICATION_SERVICE_BASE_URL: z.string({
    error: 'NOTIFICATION_SERVICE_BASE_URL is required',
  }),
  SESSION_SERVICE_BASE_URL: z.string({
    error: 'SESSION_SERVICE_BASE_URL is required',
  }),
  UPLOAD_SERVICE_BASE_URL: z.string({
    error: 'UPLOAD_SERVICE_BASE_URL is required',
  }),
  CHECKOUT_SERVICE_BASE_URL: z.string({
    error: 'CHECKOUT_SERVICE_BASE_URL is required',
  }),
  CLIENT_ORIGINS: z.string({
    error: 'CLIENT_ORIGINS is required',
  }),

  JWT_ISS: z.url({ error: 'JWT_ISS must be a valid URL' }),
  JWT_AUD: z.string({ error: 'JWT_AUD is required' }),
  JWKS_URL: z.string({ error: 'JWKS_URL must be a valid URL' }),
});

type EnvSchema = z.infer<typeof envSchema>;

export const envVariables: EnvSchema = (() => {
  try {
    return envSchema.parse(process.env);
  } catch (err) {
    console.error('Invalid environment variables:');
    if (err instanceof z.ZodError) {
      console.error(z.prettifyError(err));
    } else {
      console.error(err);
    }
    process.exit(1);
  }
})();
