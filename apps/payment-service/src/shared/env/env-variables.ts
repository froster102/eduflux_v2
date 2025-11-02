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

  GRPC_COURSE_SERVICE_URL: z.string({
    error: 'GRPC_COURSE_SERVICE_URL is required ',
  }),
  GRPC_SESSION_SERVICE_URL: z.string({
    error: 'GRPC_SESSION_SERVICE_URL is required ',
  }),
  SESSION_PAYMENT_SUCCESS_URL: z.string({
    error: 'SESSION_PAYMENT_SUCCESS_URL is required.',
  }),
  COURSE_PAYMENT_SUCCESS_URL: z.string({
    error: 'COURSE_PAYMENT_SUCCESS_URL is required.',
  }),
  PAYMENT_CANCEL_URL: z.string({
    error: 'PAYMENT_CANCEL_URL is required.',
  }),

  MONGO_URI: z.string({
    error: 'MONGO_URI must be a valid URL',
  }),

  STRIPE_API_SECRET: z.string({ error: 'STRIPE_API_SECRET is required' }),
  STRIPE_WEBHOOK_SECRET: z.string({
    error: 'STRIPE_WEBHOOK_SECRET is required.',
  }),

  RABBITMQ_USER: z.string({ error: 'RABBITMQ_USER is required' }),
  RABBITMQ_PASSWORD: z.string({ error: 'RABBITMQ_PASSWORD is required' }),
  RABBITMQ_VHOST: z.string({ error: 'RABBITMQ_VHOST is required' }),
  RABBITMQ_HOST: z.string({ error: 'RABBITMQ_HOST is required' }),
  RABBITMQ_PORT: z.coerce.number({ error: 'RABBITMQ_PORT is required' }),
  RABBITMQ_SECURE: z.string({ error: 'RABBITMQ_SECURE is required' }),
  RABBITMQ_MAX_RETRIES: z.coerce.number({
    error: 'RABBITMQ_MAX_RETRIES is required',
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
