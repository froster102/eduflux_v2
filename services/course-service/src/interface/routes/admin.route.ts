import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import type { IFileStorageGateway } from '@/application/ports/file-storage.gateway';
import { ApproveCourseInput } from '@/application/use-cases/approve-course.use-case';
import { CompleteAssetUploadDto } from '@/application/use-cases/complete-asset-upload.use-case';
import { RejectCourseInput } from '@/application/use-cases/reject-course.use-case';
import { Asset } from '@/domain/entity/asset.entity';
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
    private readonly completeAssetUploadUseCase: IUseCase<
      CompleteAssetUploadDto,
      Asset
    >,
    @inject(TYPES.ApproveCourseUseCase)
    private readonly approveCourseUseCase: IUseCase<ApproveCourseInput, Course>,
    @inject(TYPES.RejectCourseUseCase)
    private readonly rejectCourseUseCase: IUseCase<RejectCourseInput, Course>,
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
