import { IUploadCredentialsResponse } from '@/application/ports/file-storage.gateway';
import { AddAssetToLectureUseCase } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { CreateChapterUseCase } from '@/application/use-cases/create-chapter.use-case';
import { CreateCourseUseCase } from '@/application/use-cases/create-course.use-case';
import { CreateLectureUseCase } from '@/application/use-cases/create-lecture.use-case';
import { GetCourseAssetsUploadUrlUseCase } from '@/application/use-cases/get-course-assests-upload-url';
import { GetInstructorCurriculumUseCase } from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { SubmitForReviewUseCase } from '@/application/use-cases/submit-for-review.use-case';
import { UpdateChapterUseCase } from '@/application/use-cases/update-chapter.use-case';
import { ResourceType } from '@/domain/entity/asset.entity';
import { Chapter } from '@/domain/entity/chapter.entity';
import { Course } from '@/domain/entity/course.entity';
import { Lecture } from '@/domain/entity/lecture.entity';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import {
  addAssetToLectureSchema,
  addLessonSchema,
  createChapterSchema,
  createCourseSchema,
  getUploadUrlSchema,
  updateChapterSchema,
} from '@/infrastructure/http/schema/course.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.CreateCourseUseCase)
    private readonly creatCourseUseCase: CreateCourseUseCase,
    @inject(TYPES.GetInstructorCourseCurriculumUseCase)
    private readonly getInstructorCourseCurriculum: GetInstructorCurriculumUseCase,
    @inject(TYPES.CreateChapterUseCase)
    private readonly createChapterUseCase: CreateChapterUseCase,
    @inject(TYPES.UpdateChapterUseCase)
    private readonly updateChapterUseCase: UpdateChapterUseCase,
    @inject(TYPES.CreateLectureUseCase)
    private readonly createLectureUseCase: CreateLectureUseCase,
    @inject(TYPES.GetCourseAssetsUploadUrlUseCase)
    private readonly getCourseAssetsUploadUrlUseCase: GetCourseAssetsUploadUrlUseCase,
    @inject(TYPES.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: AddAssetToLectureUseCase,
    @inject(TYPES.SubmitForReviewUseCase)
    private readonly submitForReviewUseCase: SubmitForReviewUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group
        .use(authenticaionMiddleware)
        .get(
          '/me/taught-courses/:courseId/instructor-curriculum',
          async ({ params, user }): Promise<HttpResponse<Course>> => {
            const course = await this.getInstructorCourseCurriculum.execute(
              params.courseId,
              user,
            );
            return { data: course };
          },
        )
        .post('/', async ({ body, user }): Promise<HttpResponse<Course>> => {
          const parsedBody = createCourseSchema.parse(body);
          const course = await this.creatCourseUseCase.execute(
            parsedBody,
            user,
          );
          return { data: course };
        })
        .post(
          '/:courseId/chapters/',
          async ({ params, user, body }): Promise<HttpResponse<Chapter>> => {
            const parsedBody = createChapterSchema.parse(body);
            const chapter = await this.createChapterUseCase.execute(
              {
                courseId: params.courseId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
              user,
            );
            return { data: chapter };
          },
        )
        .put(
          '/:courseId/chapters/:chapterId',
          async ({ params, user, body }): Promise<HttpResponse<Chapter>> => {
            const parsedBody = updateChapterSchema.parse(body);
            const chapter = await this.updateChapterUseCase.execute(
              {
                courseId: params.courseId,
                chapterId: params.chapterId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
              user,
            );
            return { data: chapter };
          },
        )
        .post(
          '/:courseId/lectures/',
          async ({ params, body, user }): Promise<HttpResponse<Lecture>> => {
            const parsedBody = addLessonSchema.parse(body);
            const lecture = await this.createLectureUseCase.execute(
              {
                courseId: params.courseId,
                description: parsedBody.description,
                preview: parsedBody.preview,
                title: parsedBody.title,
              },
              user,
            );
            return { data: lecture };
          },
        )
        .get(
          '/:courseId/assets/get-upload-url',
          async ({
            params,
            query,
            user,
          }): Promise<HttpResponse<IUploadCredentialsResponse>> => {
            const parsedQuery = getUploadUrlSchema.parse(query);
            const response = await this.getCourseAssetsUploadUrlUseCase.execute(
              {
                courseId: params.courseId,
                resourceType: parsedQuery.resourceType as ResourceType,
              },
              user,
            );
            return { data: response };
          },
        )
        .post(
          '/:courseId/lectures/:lectureId/assets',
          async ({ body, user, params }): Promise<HttpResponse<void>> => {
            const parsedBody = addAssetToLectureSchema.parse(body);
            await this.addAssetToLectureUseCase.execute(
              {
                assetId: parsedBody.assetId,
                courseId: params.courseId,
                lectureId: params.lectureId,
              },
              user,
            );
            return {};
          },
        )
        .post(
          '/:courseId/submit-for-review',
          async ({ user, params }): Promise<HttpResponse<Course>> => {
            const course = await this.submitForReviewUseCase.execute(
              params.courseId,
              user,
            );
            return { data: course };
          },
        ),
    );
  }
}
