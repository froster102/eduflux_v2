import 'dotenv/config';

export const kafkaConfig = {
  CLIENT_ID: 'AUTH_SERVICE',
  BROKERS: [process.env.KAKFA_BROKER_URL],
};
