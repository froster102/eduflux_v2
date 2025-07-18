import { USER_SERVICE } from '../constants/services';
import { envVariables } from '../validation/env-variables';

export const kafkaConfig = {
  CLIENT_ID: USER_SERVICE,
  BROKERS: [envVariables.KAKFA_BROKER_URL],
};
