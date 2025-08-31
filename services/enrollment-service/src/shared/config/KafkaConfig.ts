import { ENROLLMENT_SERVICE } from '@shared/constants/service';
import { envVariables } from '@shared/validation/env-variables';

export class KafkaConfig {
  static readonly CLIENT_ID = ENROLLMENT_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
