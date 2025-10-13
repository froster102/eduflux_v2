import { COURSE_SERVICE } from '@shared/constants/services';
import { envVariables } from '@shared/env/env-variables';

export class KafkaConfig {
  static readonly CLIENT_ID = COURSE_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
