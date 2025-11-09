import { z } from 'zod/v4';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  HTTP_SERVER_PORT: z.coerce
    .number()
    .min(1000)
    .max(65535, 'HTTP_SERVER_PORT must be between 1000 and 65535'),

  GRPC_SERVER_PORT: z.coerce
    .number()
    .min(1000)
    .max(65535, 'GRPC_SERVER_PORT must be between 1000 and 65535'),
  GRPC_USER_SERVICE_URL: z.string({
    error: 'GRPC_USER_SERVICE_URL is required',
  }),

  DATABASE_URL: z.string({
    error: 'DATABASE_URL must be a valid URL',
  }),

  PAYMENT_SUCCESS_URL: z.string({ error: 'PAYMENT_SUCCESS_URL is required.' }),
  PAYMENT_CANCEL_URL: z.string({ error: 'PAYMENT_CANCEL_URL is required.' }),

  LIVEKIT_API_KEY: z.string({ error: 'LIVEKIT_API_KEY is required' }),
  LIVEKIT_API_SECRET: z.string({ error: 'LIVEKIT_API_SECRET is required' }),
  LIVEKIT_HOST: z.string({ error: 'LIVEKIT_HOST is required' }),

  JOIN_SESSION_PAGE_URL: z.string({
    error: 'JOIN_SESSION_BASE_URL_PATH is required',
  }),

  SESSION_PAGE_PATH: z.string({
    error: 'SESSION_PAGE_PATH is required',
  }),

  JWT_ISS: z.url({ error: 'JWT_ISS must be a valid URL' }),
  JWT_AUD: z.string({ error: 'JWT_AUD is required' }),
  JWKS_URL: z.string({ error: 'JWKS_URL must be a valid URL' }),

  RABBITMQ_USER: z.string({ error: 'RABBITMQ_USER is required' }),
  RABBITMQ_PASSWORD: z.string({ error: 'RABBITMQ_PASSWORD is required' }),
  RABBITMQ_VHOST: z.string({ error: 'RABBITMQ_VHOST is required' }),
  RABBITMQ_HOST: z.string({ error: 'RABBITMQ_HOST is required' }),
  RABBITMQ_PORT: z.coerce.number({ error: 'RABBITMQ_PORT is required' }),
  RABBITMQ_SECURE: z.string({ error: 'RABBITMQ_SECURE is required' }),
  RABBITMQ_MAX_RETRIES: z.coerce.number({
    error: 'RABBITMQ_MAX_RETRIES is required',
  }),

  IMAGE_BASE_URL: z.string({ error: 'IMAGE_BASE_URL is required.' }),

  REDIS_HOST: z
    .string({ error: 'REDIS_HOST is required' })
    .default('localhost'),
  REDIS_PORT: z.coerce
    .number({ error: 'REDIS_PORT is required' })
    .default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().optional().default(0),
  REDIS_TLS: z.string().optional(),
  REDIS_CONNECTION_TIMEOUT: z.coerce.number().optional().default(10000),
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
