import { QUERY_SERVICE } from "@shared/constants/services";
import { envVariables } from "@shared/env/env-variables";

export class KafkaConfig {
  static readonly CLIENT_ID = QUERY_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
