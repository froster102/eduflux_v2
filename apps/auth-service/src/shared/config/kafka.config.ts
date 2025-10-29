import { AUTH_SERVICE } from '../constants/services';
import { envVariables } from '../env/env-variables';

export const kafkaConfig = {
  CLIENT_ID: AUTH_SERVICE,
  BROKERS: [envVariables.KAKFA_BROKER_URL],
};
