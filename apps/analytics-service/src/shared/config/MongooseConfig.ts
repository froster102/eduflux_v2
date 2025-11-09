import { envVariables } from '@shared/env/env-variables';

export class MongooseConfig {
  static readonly MONGO_URI = envVariables.MONGO_URI;
}

