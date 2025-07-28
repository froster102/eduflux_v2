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
  GRPC_PAYMENT_SERVICE_URL: z.string({
    error: 'GRPC_PAYMENT_SERVICE_URL is required ',
  }),

  DATABASE_URL: z.string({
    error: 'DATABASE_URL must be a valid URL',
  }),

  PAYMENT_SUCCESS_URL: z.string({ error: 'PAYMENT_SUCCESS_URL is required.' }),
  PAYMENT_CANCEL_URL: z.string({ error: 'PAYMENT_CANCEL_URL is required.' }),

  JWT_ISS: z.url({ error: 'JWT_ISS must be a valid URL' }),
  JWT_AUD: z.string({ error: 'JWT_AUD is required' }),
  JWKS_URL: z.string({ error: 'JWKS_URL must be a valid URL' }),

  KAKFA_BROKER_URL: z.string({ error: 'KAKFA_BROKER_URL is required' }),

  IMAGE_BASE_URL: z.string({ error: 'IMAGE_BASE_URL is required.' }),
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
