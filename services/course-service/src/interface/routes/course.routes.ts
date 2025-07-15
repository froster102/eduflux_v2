import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { AddAssetToLectureInput } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { CreateChapterInput } from '@/application/use-cases/create-chapter.use-case';
import { CreateCourseInput } from '@/application/use-cases/create-course.use-case';
import { CreateLectureInput } from '@/application/use-cases/create-lecture.use-case';
import {
  CurriculumItemWithAsset,
  GetInstructorCourseCurriculumInput,
} from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { GetInstructorCourseInput } from '@/application/use-cases/get-instructor-course.use-case';
import {
  ReorderCurriculumDto,
  ReorderCurriculumInput,
} from '@/application/use-cases/reorder-curriculum.use-case';
import { UpdateChapterInput } from '@/application/use-cases/update-chapter.use-case';
import { UpdateCourseInput } from '@/application/use-cases/update-course.use-case';
import { UpdateLectureInput } from '@/application/use-cases/update-lecture.use-case';
import { Course } from '@/domain/entity/course.entity';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import {
  addAssetToLectureSchema,
  createLectureSchema,
  createChapterSchema,
  createCourseSchema,
  reorderCurriculumSchema,
  updateChapterSchema,
  updateCourseSchema,
  updateLessonSchema,
} from '@/infrastructure/http/schema/course.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { DeleteChapterInput } from '@/application/use-cases/delete-chapter.use-case';
import { DeleteLectureInput } from '@/application/use-cases/delete-lecture.use-case';
import { PublishCourseInput } from '@/application/use-cases/publish-course.use-case';
import { Chapter } from '@/domain/entity/chapter.entity';
import { Lecture } from '@/domain/entity/lecture.entity';
import { Category } from '@/domain/entity/category.entity';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.CreateCourseUseCase)
    private readonly creatCourseUseCase: IUseCase<CreateCourseInput, Course>,
    @inject(TYPES.UpdateCourseUseCase)
    private readonly updateCourseUseCase: IUseCase<UpdateCourseInput, Course>,
    @inject(TYPES.GetInstructorCourseCurriculumUseCase)
    private readonly getInstructorCourseCurriculum: IUseCase<
      GetInstructorCourseCurriculumInput,
      CurriculumItemWithAsset[]
    >,
    @inject(TYPES.CreateChapterUseCase)
    private readonly createChapterUseCase: IUseCase<
      CreateChapterInput,
      Chapter
    >,
    @inject(TYPES.UpdateChapterUseCase)
    private readonly updateChapterUseCase: IUseCase<
      UpdateChapterInput,
      Chapter
    >,
    @inject(TYPES.CreateLectureUseCase)
    private readonly createLectureUseCase: IUseCase<
      CreateLectureInput,
      Lecture
    >,
    @inject(TYPES.UpdateLectureUseCase)
    private readonly updateLectureUseCase: IUseCase<
      UpdateLectureInput,
      Lecture
    >,
    @inject(TYPES.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: IUseCase<
      AddAssetToLectureInput,
      void
    >,
    // @inject(TYPES.SubmitForReviewUseCase)
    // private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    @inject(TYPES.ReorderCurriculumUseCase)
    private readonly reorderCurriculumUseCase: IUseCase<
      ReorderCurriculumInput,
      void
    >,
    @inject(TYPES.GetInstructorCourseUseCase)
    private readonly getInstructorCourseUseCase: IUseCase<
      GetInstructorCourseInput,
      Course
    >,
    @inject(TYPES.DeleteChapterUseCase)
    private readonly deleteChapterUseCase: IUseCase<DeleteChapterInput, void>,
    @inject(TYPES.DeleteLectureUseCase)
    private readonly deleteLectureUseCase: IUseCase<DeleteLectureInput, void>,
    @inject(TYPES.PublishCourseUseCase)
    private readonly publishCourseUseCase: IUseCase<PublishCourseInput, Course>,
    @inject(TYPES.GetCourseCategoriesUseCase)
    private readonly getCourseCategories: IUseCase<void, Category[]>,
  ) {}

  register(): Elysia {
    return new Elysia().group(
      '/api/courses',
      (group) =>
        group
          .get('/course-categories', async () => {
            const categories = await this.getCourseCategories.execute();
            return { categories };
          })
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
          .post('/:courseId/chapters/', async ({ params, user, body }) => {
            const parsedBody = createChapterSchema.parse(body);
            const chapter = await this.createChapterUseCase.execute({
              createChapterDto: {
                courseId: params.courseId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
              actor: user,
            });
            return chapter.toJSON();
          })
          .put(
            '/:courseId/chapters/:chapterId',
            async ({ params, user, body }) => {
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
              return chapter.toJSON();
            },
          )
          .delete(
            '/:courseId/chapters/:chapterId',
            async ({ params, user }) => {
              await this.deleteChapterUseCase.execute({
                deleteChapterDto: {
                  chapterId: params.chapterId,
                  courseId: params.courseId,
                },
                actor: user,
              });
              return;
            },
          )
          .post('/:courseId/lectures/', async ({ params, body, user }) => {
            const parsedBody = createLectureSchema.parse(body);
            const lecture = await this.createLectureUseCase.execute({
              createLectureDto: {
                courseId: params.courseId,
                description: parsedBody.description,
                preview: parsedBody.preview,
                title: parsedBody.title,
              },
              actor: user,
            });
            return lecture.toJSON();
          })
          .put(
            '/:courseId/lectures/:lectureId',
            async ({ params, body, user }) => {
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
              return lecture.toJSON();
            },
          )
          .delete(
            '/:courseId/lectures/:lectureId',
            async ({ params, user }) => {
              await this.deleteLectureUseCase.execute({
                actor: user,
                deleteLectureDto: {
                  courseId: params.courseId,
                  lectureId: params.lectureId,
                },
              });
            },
          )
          .post(
            '/:courseId/lectures/:lectureId/assets',
            async ({ body, user, params }) => {
              const parsedBody = addAssetToLectureSchema.parse(body);
              await this.addAssetToLectureUseCase.execute({
                addAssetToLectureDto: {
                  resourceType: parsedBody.resourceType as 'image' | 'video',
                  key: parsedBody.key,
                  fileName: parsedBody.fileName,
                  uuid: parsedBody.uuid,
                  courseId: params.courseId,
                  lectureId: params.lectureId,
                },
                actor: user,
              });
              return {};
            },
          )
          .post(`/:courseId/publish`, async ({ params, user }) => {
            await this.publishCourseUseCase.execute({
              actor: user,
              courseId: params.courseId,
            });
            return { published: true };
          }),
      // .post('/:courseId/submit-for-review', async ({ user, params }) => {
      //   const course = await this.submitForReviewUseCase.execute({
      //     courseId: params.courseId,
      //     actor: user,
      //   });
      //   return { data: course };
      // })
    );
  }
}
