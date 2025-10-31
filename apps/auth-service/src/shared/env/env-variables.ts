import { z } from 'zod/v4';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  HTTP_SERVER_PORT: z.coerce
    .number()
    .min(1000)
    .max(65535, 'HTTP_SERVER_PORT must be between 1000 and 65535'),

  DATABASE_URL: z.string({
    error: 'DATABASE_URL must be a valid URL',
  }),

  BETTER_AUTH_SECRET: z.string({
    error: 'BETTER_AUTH_SECRET is required',
  }),

  JWT_ISS: z.url({ error: 'JWT_ISS must be a valid URL' }),
  JWT_AUD: z.string({ error: 'JWT_AUD is required' }),
  JWT_EXP: z.string({ error: 'JWT_EXP is required' }),

  CLIENT_URL: z.string({ error: 'CLIENT_URL is required' }),

  GOOGLE_CLIENT_ID: z.string({ error: 'GOOGLE_CLIENT_ID is required' }),
  GOOGLE_CLIENT_SECRET: z.string({ error: 'GOOGLE_CLIENT_SECRET is required' }),
  REDIRECT_URI: z.string({ error: 'REDIRECT_URI is required' }),

  ADMIN_EMAIL: z.string({ error: 'ADMIN_EMAIL is required' }),
  ADMIN_PASSWORD: z.string({ error: 'ADMIN_PASSWORD is required' }),

  SMTP_USER: z.string({ error: 'SMTP_USER is required' }),
  SMTP_PASS: z.string({ error: 'SMTP_PASS is required' }),
  SMTP_HOST: z.string({ error: 'SMTP_HOST is required' }),

  RABBITMQ_USER: z.string({ error: 'RABBITMQ_USER is required' }),
  RABBITMQ_PASSWORD: z.string({ error: 'RABBITMQ_PASSWORD is required' }),
  RABBITMQ_VHOST: z.string({ error: 'RABBITMQ_VHOST is required' }),
  RABBITMQ_HOST: z.string({ error: 'RABBITMQ_HOST is required' }),
  RABBITMQ_PORT: z.coerce.number({ error: 'RABBITMQ_PORT is required' }),
  RABBITMQ_SECURE: z.string({ error: 'RABBITMQ_SECURE is required' }),
  RABBITMQ_MAX_RETRIES: z.coerce.number({
    error: 'RABBITMQ_MAX_RETRIES is required',
  }),

  GRPC_USER_SERVICE_URL: z.string({
    error: 'GRPC_USER_SERVICE_URL is required',
  }),
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
