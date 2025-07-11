import { ENROLLMENT_SERVICE } from '../constants/service';

export const kafkaConfig = {
  CLIENT_ID: ENROLLMENT_SERVICE,
  BROKERS: [process.env.KAKFA_BROKER_URL!],
};
