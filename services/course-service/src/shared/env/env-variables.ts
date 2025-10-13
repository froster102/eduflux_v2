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
  GRPC_ENROLLMENT_SERVICE_URL: z.string({
    error: 'GRPC_ENROLLMENT_SERVICE_URL is required ',
  }),

  DATABASE_URL: z.string({
    error: 'DATABASE_URL must be a valid URL',
  }),

  JWT_ISS: z.url({ error: 'JWT_ISS must be a valid URL' }),
  JWT_AUD: z.string({ error: 'JWT_AUD is required' }),
  JWKS_URL: z.string({ error: 'JWKS_URL must be a valid URL' }),

  KAKFA_BROKER_URL: z.string({ error: 'KAKFA_BROKER_URL is required' }),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
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
