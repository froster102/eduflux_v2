import { PAYMENT_SERVICE } from '../constants/service';
import { envVariables } from '../validation/env-variables';

export const kafkaConfig = {
  CLIENT_ID: PAYMENT_SERVICE,
  BROKERS: [envVariables.KAKFA_BROKER_URL],
};
