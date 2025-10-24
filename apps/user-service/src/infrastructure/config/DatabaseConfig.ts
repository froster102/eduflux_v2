import { envVariables } from '@shared/validation/env-variables';

export class DatabaseConfig {
  static MONGO_URI = envVariables.DATABASE_URL;
}
