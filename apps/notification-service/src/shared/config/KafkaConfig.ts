import { NOTIFICATION_SERVICE } from '@shared/constants/services';
import { envVariables } from '@shared/env/envVariables';

export class KafkaConfig {
  static readonly CLIENT_ID = NOTIFICATION_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
