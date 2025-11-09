import { envVariables } from '@/shared/env/env-variables';
import './src/shared/polyfills/compression-polyfill';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/auth.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: envVariables.DATABASE_URL,
  },
});
