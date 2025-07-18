import { envVariables } from '../validation/env-variables';

export const dbConfig = {
  MONGO_URI: envVariables.DATABASE_URL,
};
