import { USER_SERVICE } from '@shared/constants/services';
import { envVariables } from '@shared/env/env-variables';

export class KafkaConfig {
  static CLIENT_ID = USER_SERVICE;
  static BROKERS = [envVariables.KAKFA_BROKER_URL];
}
