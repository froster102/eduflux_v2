import { envVariables } from '../validation/env-variables';

export const emailConfig = {
  SMTP_HOST: envVariables.SMTP_HOST,
  SMTP_USER: envVariables.SMTP_USER,
  SMTP_PASS: envVariables.SMTP_PASS,
};
