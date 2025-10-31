import { envVariables } from '@shared/env/envVariables';

export class MongooseConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
