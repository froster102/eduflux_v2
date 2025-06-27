import { IUploadCredentialsResponse } from '@/application/ports/file-storage.gateway';
import { AddAssetToLectureUseCase } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { CreateChapterUseCase } from '@/application/use-cases/create-chapter.use-case';
import { CreateCourseUseCase } from '@/application/use-cases/create-course.use-case';
import { CreateLectureUseCase } from '@/application/use-cases/create-lecture.use-case';
import { GetAllInstructorCoursesUseCase } from '@/application/use-cases/get-all-instructor-course.use-case';
import { GetCourseAssetsUploadUrlUseCase } from '@/application/use-cases/get-course-assests-upload-url.use-case';
import { GetInstructorCourseCurriculumUseCase } from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { GetInstructorCourseUseCase } from '@/application/use-cases/get-instructor-course.use-case';
import {
  ReorderCurriculumDto,
  ReorderCurriculumUseCase,
} from '@/application/use-cases/reorder-curriculum.use-case';
import { SubmitForReviewUseCase } from '@/application/use-cases/submit-for-review.use-case';
import { UpdateChapterUseCase } from '@/application/use-cases/update-chapter.use-case';
import { UpdateCourseUseCase } from '@/application/use-cases/update-course.use-case';
import { UpdateLectureUseCase } from '@/application/use-cases/update-lecture.use-case';
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
  reorderCurriculumSchema,
  updateChapterSchema,
  updateCourseSchema,
  updateLessonSchema,
} from '@/infrastructure/http/schema/course.schema';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.CreateCourseUseCase)
    private readonly creatCourseUseCase: CreateCourseUseCase,
    @inject(TYPES.UpdateCourseUseCase)
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    @inject(TYPES.GetInstructorCourseCurriculumUseCase)
    private readonly getInstructorCourseCurriculum: GetInstructorCourseCurriculumUseCase,
    @inject(TYPES.CreateChapterUseCase)
    private readonly createChapterUseCase: CreateChapterUseCase,
    @inject(TYPES.UpdateChapterUseCase)
    private readonly updateChapterUseCase: UpdateChapterUseCase,
    @inject(TYPES.CreateLectureUseCase)
    private readonly createLectureUseCase: CreateLectureUseCase,
    @inject(TYPES.UpdateLectureUseCase)
    private readonly updateLectureUseCase: UpdateLectureUseCase,
    @inject(TYPES.GetCourseAssetsUploadUrlUseCase)
    private readonly getCourseAssetsUploadUrlUseCase: GetCourseAssetsUploadUrlUseCase,
    @inject(TYPES.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: AddAssetToLectureUseCase,
    @inject(TYPES.SubmitForReviewUseCase)
    private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    @inject(TYPES.GetAllInstructorCoursesUseCase)
    private readonly getAllInstructorCoursesUseCase: GetAllInstructorCoursesUseCase,
    @inject(TYPES.ReorderCurriculumUseCase)
    private readonly reorderCurriculumUseCase: ReorderCurriculumUseCase,
    @inject(TYPES.GetInstructorCourseUseCase)
    private readonly getInstructorCourseUseCase: GetInstructorCourseUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group
        .use(authenticaionMiddleware)
        .post('/', async ({ body, user }): Promise<HttpResponse<Course>> => {
          const parsedBody = createCourseSchema.parse(body);
          const course = await this.creatCourseUseCase.execute({
            createCourseDto: parsedBody,
            actor: user,
          });
          return { data: course };
        })
        .get('/:courseId/', async ({ params, user }) => {
          const course = await this.getInstructorCourseUseCase.execute({
            id: params.courseId,
            actor: user,
          });
          return course.toJSON();
        })
        .put('/:courseId', async ({ params, user, body }) => {
          const parsedBody = updateCourseSchema.parse(body);

          const course = await this.updateCourseUseCase.execute({
            actor: user,
            updateCourseDto: {
              ...parsedBody,
              courseId: params.courseId,
              description: purify.sanitize(parsedBody.description ?? ''),
            },
          });
          return course.toJSON();
        })
        .get('/:courseId/instructor-curriculum', async ({ params, user }) => {
          const curriculumItems =
            await this.getInstructorCourseCurriculum.execute({
              id: params.courseId,
              actor: user,
            });
          return { data: curriculumItems };
        })
        .put(
          '/:courseId/instructor-curriculum',
          async ({ body, params, user }) => {
            const parsedBody = reorderCurriculumSchema.parse(
              body,
            ) as ReorderCurriculumDto;
            await this.reorderCurriculumUseCase.execute({
              reorderCurriculumDto: {
                courseId: params.courseId,
                items: parsedBody.items,
              },
              actor: user,
            });
          },
        )
        .post(
          '/:courseId/chapters/',
          async ({ params, user, body }): Promise<HttpResponse<Chapter>> => {
            const parsedBody = createChapterSchema.parse(body);
            const chapter = await this.createChapterUseCase.execute({
              createChapterDto: {
                courseId: params.courseId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
              actor: user,
            });
            return { data: chapter };
          },
        )
        .put(
          '/:courseId/chapters/:chapterId',
          async ({ params, user, body }): Promise<HttpResponse<Chapter>> => {
            const parsedBody = updateChapterSchema.parse(body);
            const chapter = await this.updateChapterUseCase.execute({
              updateChapterDto: {
                courseId: params.courseId,
                chapterId: params.chapterId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
              actor: user,
            });
            return { data: chapter };
          },
        )
        .post(
          '/:courseId/lectures/',
          async ({ params, body, user }): Promise<HttpResponse<Lecture>> => {
            const parsedBody = addLessonSchema.parse(body);
            const lecture = await this.createLectureUseCase.execute({
              createLectureDto: {
                courseId: params.courseId,
                description: parsedBody.description,
                preview: parsedBody.preview,
                title: parsedBody.title,
              },
              actor: user,
            });
            return { data: lecture };
          },
        )
        .put(
          '/:courseId/lectures/:lectureId',
          async ({ params, body, user }): Promise<HttpResponse<Lecture>> => {
            const parsedBody = updateLessonSchema.parse(body);
            const lecture = await this.updateLectureUseCase.execute({
              updateLectureDto: {
                courseId: params.courseId,
                lectureId: params.lectureId,
                description: parsedBody.description,
                preview: parsedBody.preview,
                title: parsedBody.title,
              },
              actor: user,
            });
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
                getCourseAssetsUploadUrlDto: {
                  courseId: params.courseId,
                  resourceType: parsedQuery.resourceType as ResourceType,
                },
                actor: user,
              },
            );
            return { data: response };
          },
        )
        .post(
          '/:courseId/lectures/:lectureId/assets',
          async ({ body, user, params }): Promise<HttpResponse<void>> => {
            const parsedBody = addAssetToLectureSchema.parse(body);
            await this.addAssetToLectureUseCase.execute({
              addAssetToLectureDto: {
                assetId: parsedBody.assetId,
                courseId: params.courseId,
                lectureId: params.lectureId,
              },
              actor: user,
            });
            return {};
          },
        )
        .post(
          '/:courseId/submit-for-review',
          async ({ user, params }): Promise<HttpResponse<Course>> => {
            const course = await this.submitForReviewUseCase.execute({
              courseId: params.courseId,
              actor: user,
            });
            return { data: course };
          },
        )
        .get('/me/taught-courses', async ({ user, query }) => {
          const paredQuery = paginationQuerySchema.parse(query);
          const response = await this.getAllInstructorCoursesUseCase.execute({
            actorId: user.id,
            paginationQueryParams: paredQuery,
          });
          return response;
        }),
    );
  }
}
