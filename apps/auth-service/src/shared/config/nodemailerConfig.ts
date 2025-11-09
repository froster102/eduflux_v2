import { envVariables } from '../env/env-variables';

export const nodemailerConfig = {
  SMTP_HOST: envVariables.SMTP_HOST,
  SMTP_USER: envVariables.SMTP_USER,
  SMTP_PASS: envVariables.SMTP_PASS,
};
