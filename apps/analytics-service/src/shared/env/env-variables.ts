import { z } from 'zod/v4';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  HTTP_SERVER_PORT: z.coerce
    .number()
    .min(1000)
    .max(65535, 'HTTP_SERVER_PORT must be between 1000 and 65535'),

  MONGO_URI: z.string({
    error: 'MONGO_URI must be a valid URL',
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

  REDIS_HOST: z.string({ error: 'REDIS_HOST is required' }),
  REDIS_PORT: z.coerce.number({ error: 'REDIS_PORT is required' }),
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
