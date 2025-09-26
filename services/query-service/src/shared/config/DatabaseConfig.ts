import { envVariables } from "@shared/env/env-variables";

export class DatabaseConfig {
  static readonly MONGO_URI = envVariables.DATABASE_URL;
}
