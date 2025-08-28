import { USER_SERVICE } from '@shared/constants/services';
import { envVariables } from '@shared/validation/env-variables';

export class KafkaConfig {
  static CLIENT_ID = USER_SERVICE;
  static BROKERS = [envVariables.KAKFA_BROKER_URL];
}
