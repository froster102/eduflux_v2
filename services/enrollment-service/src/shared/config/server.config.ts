export const serverConfig = {
  PORT: Number(process.env.HTTP_PORT),
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
};
