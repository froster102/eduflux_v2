import { envVariables } from '@shared/env/env-variables';

export class DatabaseConfig {
  static MONGO_URI = envVariables.DATABASE_URL;
}
