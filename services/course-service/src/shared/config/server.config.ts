export const serverConfig = {
  PORT: Number(process.env.HTTP_SERVER_PORT),
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};
