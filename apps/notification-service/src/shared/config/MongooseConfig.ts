import { envVariables } from '@shared/env/envVariables';

export class MongooseConnectionConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
