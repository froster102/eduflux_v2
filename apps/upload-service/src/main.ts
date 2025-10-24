import { Elysia } from 'elysia';
import { serverConfig } from './shared/config/server.config';
import { Logger } from './shared/utlis/logger';
import { UPLOAD_SERVICE } from './shared/constants/services';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { uploadSchema } from './validation/schema/upload.schema';
import { uploadService } from './services';

const app = new Elysia().get('/api/uploads/health', () => ({ ok: true }));

app.use(httpLoggerMiddleware);
app.use(errorHandler);

app.post('/api/uploads/get-upload-credentials', ({ body }) => {
  const parsedBody = uploadSchema.parse(body);

  const response = uploadService.generateCloudinaryUploadCredentials({
    fileName: parsedBody.fileName,
    resourceType: parsedBody.resourceType,
    contentType: '',
  });

  return response;
});

app.listen(serverConfig.PORT);

const logger = new Logger('UPLOAD_SERVICE');

logger.info(`[${UPLOAD_SERVICE}] listening on port ${serverConfig.PORT}`);
