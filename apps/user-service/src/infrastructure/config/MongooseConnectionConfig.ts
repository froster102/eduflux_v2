import { envVariables } from '@shared/env/env-variables';

export class MongooseConnectionConfig {
  static MONGO_URI = envVariables.DATABASE_URL;
}
