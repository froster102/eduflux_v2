import 'dotenv/config';

export const serverConfig = {
  PORT: Number(process.env.SERVICE_PORT),
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};
