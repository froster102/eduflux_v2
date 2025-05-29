import 'dotenv/config';

export const serverConfig = {
  PORT: Number(process.env.SERVICE_PORT),
  CLIENT_URL: process.env.CLIENT_URL,
};
