import { envVariables } from '@/shared/validation/env-variables';
import { COURSE_SERVICE } from '../constants/services';

export const kafkaConfig = {
  CLIENT_ID: COURSE_SERVICE,
  BROKERS: [envVariables.KAKFA_BROKER_URL],
};
