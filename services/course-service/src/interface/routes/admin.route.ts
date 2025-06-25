import type { IFileStorageGateway } from '@/application/ports/file-storage.gateway';
import { ApproveCourseUseCase } from '@/application/use-cases/approve-course.use-case';
import { CompleteAssetUploadUseCase } from '@/application/use-cases/complete-asset-upload.use-case';
import { RejectCourseUseCase } from '@/application/use-cases/reject-course.use-case';
import { ResourceType } from '@/domain/entity/asset.entity';
import { Course } from '@/domain/entity/course.entity';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { rejectCourseSchema } from '@/infrastructure/http/schema/course.schema';
import { COURSE_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';

@injectable()
export class AdminRoutes {
  private logger = new Logger(COURSE_SERVICE);
  constructor(
    @inject(TYPES.FileStorageGateway)
    private readonly fileStorageGateway: IFileStorageGateway,
    @inject(TYPES.CompleteAssetUploadUseCase)
    private readonly completeAssetUploadUseCase: CompleteAssetUploadUseCase,
    @inject(TYPES.ApproveCourseUseCase)
    private readonly approveCourseUseCase: ApproveCourseUseCase,
    @inject(TYPES.RejectCourseUseCase)
    private readonly rejectCourseUseCase: RejectCourseUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group
        .post(
          '/webhooks/cloudinary/uploads',
          async ({ headers, body, set }) => {
            const signature = headers['x-cld-signature'] as string;

            const timestamp = headers['x-cld-timestamp'] as string;

            const payload = body;

            if (!signature || !timestamp || !payload) {
              set.status = 400;

              this.logger.warn('Missing webhook header or payload');
              return 'Missing webhook header or payload';
            }

            const isVerified = this.fileStorageGateway.verifyWebhookSignature({
              signature,
              timestamp,
              payload,
            });

            if (!isVerified) {
              set.status = 403;
              return 'Invalid webhook signature';
            }

            await this.completeAssetUploadUseCase.execute({
              additionalMetadata: (payload as Record<string, any>) || null,
              duration:
                ((payload as Record<string, any>).duration as number) || null,
              providerSpecificId: (payload as Record<string, any>)
                .public_id as string,
              originalFileName: (payload as Record<string, any>)
                .original_filename as string,
              mediaSource: {
                type: 'application/x-mpegURL',
                src: (payload as Record<string, any>).secure_url as string,
              },
              resourseType: (payload as Record<string, any>)
                .resource_type as ResourceType,
            });

            return;
          },
        )
        .use(authenticaionMiddleware)
        .patch(
          '/:courseId/approve',
          async ({ params, user }): Promise<HttpResponse<Course>> => {
            const course = await this.approveCourseUseCase.execute({
              courseId: params.courseId,
              actor: user,
            });
            return { data: course };
          },
        )
        .patch(
          '/:courseId/reject',
          async ({ params, user, body }): Promise<HttpResponse<Course>> => {
            const paredBody = rejectCourseSchema.parse(body);
            const course = await this.rejectCourseUseCase.execute({
              actor: user,
              rejectCourseDto: {
                courseId: params.courseId,
                feedback: paredBody.feedback,
              },
            });
            return { data: course };
          },
        ),
    );
  }
}
