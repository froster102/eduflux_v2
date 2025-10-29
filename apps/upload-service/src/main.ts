import { errorHandler } from '@/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@/middlewares/httpLoggerMiddleware';
import { uploadService } from '@/services';
import { httpServerConfig } from '@/shared/config/httpServerConfig';
import { logger } from '@/shared/utlis/logger';
import { uploadSchema } from '@/validators/upload.schema';
import { Elysia } from 'elysia';

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

app.listen(httpServerConfig.PORT);

logger.info(`Http Server listening on port ${httpServerConfig.PORT}`);
