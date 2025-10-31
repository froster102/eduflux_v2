import { envVariables } from '@shared/env/env-variables';

export class MongooseConnectionConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
