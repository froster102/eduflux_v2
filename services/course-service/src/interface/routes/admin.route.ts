import type { IRejectCourseUseCase } from '@/application/use-cases/interface/reject-course.interface';
import type { ICompleteAssetUploadUseCase } from '@/application/use-cases/interface/complete-asset-upload.interface';
import type { IApproveCourseUseCase } from '@/application/use-cases/interface/approve-course.interface';
import type { IFileStorageGateway } from '@/application/ports/file-storage.gateway';
import { Course } from '@/domain/entity/course.entity';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { rejectCourseSchema } from '@/infrastructure/http/schema/course.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import type { ILogger } from '@/shared/common/interfaces/logger.interface';

@injectable()
export class AdminRoutes {
  constructor(
    @inject(TYPES.FileStorageGateway)
    private readonly fileStorageGateway: IFileStorageGateway,
    @inject(TYPES.CompleteAssetUploadUseCase)
    private readonly completeAssetUploadUseCase: ICompleteAssetUploadUseCase,
    @inject(TYPES.ApproveCourseUseCase)
    private readonly approveCourseUseCase: IApproveCourseUseCase,
    @inject(TYPES.RejectCourseUseCase)
    private readonly rejectCourseUseCase: IRejectCourseUseCase,
    @inject(TYPES.Logger) private readonly logger: ILogger,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group
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
              courseId: params.courseId,
              feedback: paredBody.feedback,
            });
            return { data: course };
          },
        ),
    );
  }
}
