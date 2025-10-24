import { envVariables } from "@shared/env/envVariables";

export class NodeMailerConfig {
  static readonly SMTP_HOST = envVariables.SMTP_HOST;
  static readonly SMTP_PASS = envVariables.SMTP_PASS;
  static readonly SMTP_USER = envVariables.SMTP_USER;
  static readonly SMTP_PORT = envVariables.SMTP_PORT;
}
