import { CHAT_SERVICE } from "@shared/constants/service";
import { envVariables } from "@shared/env/envVariables";

export class KafkaConfig {
  static readonly CLIENT_ID = CHAT_SERVICE;
  static readonly BROKERS = [envVariables.KAKFA_BROKER_URL];
}
