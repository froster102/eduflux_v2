import { SESSION_SERVICE } from '../constants/services';
import { envVariables } from '../validation/env-variables';

export const kafkaConfig = {
  CLIENT_ID: SESSION_SERVICE,
  BROKERS: [envVariables.KAKFA_BROKER_URL],
};
