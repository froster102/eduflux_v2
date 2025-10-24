import { PAYMENT_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/env/env-variables';

export class KafkaConfig {
  static readonly CLIENT_ID = PAYMENT_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
