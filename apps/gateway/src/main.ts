import 'reflect-metadata';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import { envVariables } from '@gateway/utils/env/envVariables';
import { httpLogger } from '@gateway/middleware/httpLoggerMiddleware';
import { logger } from '@gateway/utils/logging/logger';

const app = express();

const corsOptions: CorsOptions = {
  origin: envVariables.CLIENT_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-request-id',
    'x-correlation-id',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(httpLogger());

const SERVICES: Record<string, string> = {
  auth: envVariables.AUTH_SERVICE_BASE_URL,
  users: envVariables.USER_SERVICE_BASE_URL,
  payments: envVariables.PAYMENT_SERVICE_BASE_URL,
  chats: envVariables.CHAT_SERVICE_BASE_URL,
  courses: envVariables.COURSE_SERVICE_BASE_URL,
  sessions: envVariables.SESSION_SERVICE_BASE_URL,
  notifications: envVariables.NOTIFICATION_SERVICE_BASE_URL,
  uploads: envVariables.UPLOAD_SERVICE_BASE_URL,
};

for (const [name, target] of Object.entries(SERVICES)) {
  app.use(
    `/api/${name}`,
    createProxyMiddleware({
      target: `${target}/api/${name}`,
      changeOrigin: true,
      ws: true,
    }),
  );
}

app.use(
  '/ws/chats/',
  createProxyMiddleware({
    target: `${envVariables.CHAT_SERVICE_BASE_URL}/ws/chats/`,
    changeOrigin: true,
    ws: true,
  }),
);

app.listen(8000, () => {
  logger.info(
    `🚀 API Gateway running on http://localhost:${envVariables.HTTP_SERVER_PORT}`,
  );
  Object.keys(SERVICES).forEach((service) =>
    logger.info(`  /api/${service}  →  ${SERVICES[service]}`),
  );
});
