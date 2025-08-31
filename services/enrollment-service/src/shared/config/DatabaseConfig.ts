import { envVariables } from '@shared/validation/env-variables';

export class DatabaseConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
