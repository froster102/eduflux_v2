import { envVariables } from '@shared/env/envVariables';

export class DatabaseConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
