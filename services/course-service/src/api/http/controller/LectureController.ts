import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import Elysia from 'elysia';
import { inject } from 'inversify';
import { addAssetToLectureSchema } from '@api/http/validators/addAssetToLectureSchema';
import { AssetDITokens } from '@core/application/asset/di/AssetDITokens';
import type { AddAssetToLectureUseCase } from '@core/application/asset/usecase/AddAssetToLectureUseCase';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { DeleteLectureUseCase } from '@core/application/lecture/usecase/DeleteLectureUseCase';
import { createLectureSchema } from '@api/http/validators/createLectureSchema';
import type { CreateLectureUseCase } from '@core/application/lecture/usecase/CreateLectureUseCase';
import { updateLessonSchema } from '@api/http/validators/updateLessonSchema';
import type { UpdateLectureUseCase } from '@core/application/lecture/usecase/UpdateLectureUseCase';
import type { GetSubscriberLectureUseCase } from '@core/application/lecture/usecase/GetSubscriberLectureUseCase';

export class LectureController {
  constructor(
    @inject(AssetDITokens.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: AddAssetToLectureUseCase,
    @inject(LectureDITokens.DeleteLectureUseCase)
    private readonly deleteLectureUseCase: DeleteLectureUseCase,
    @inject(LectureDITokens.CreateLectureUseCase)
    private readonly createLectureUseCase: CreateLectureUseCase,
    @inject(LectureDITokens.UpdateLectureUseCase)
    private readonly updateLectureUseCase: UpdateLectureUseCase,
    @inject(LectureDITokens.GetSubscriberLectureUseCase)
    private readonly getSubscriberLectureUseCase: GetSubscriberLectureUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses/:id/lectures', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/:lectureId', async ({ params, user }) => {
          const response = await this.getSubscriberLectureUseCase.execute({
            lectureId: params.lectureId,
            userId: user.id,
          });
          return response;
        })
        .post('/', async ({ params, body, user }) => {
          const parsedBody = createLectureSchema.parse(body);
          const lecture = await this.createLectureUseCase.execute({
            courseId: params.id,
            description: parsedBody.description,
            preview: parsedBody.preview,
            title: parsedBody.title,
            actor: user,
          });
          return lecture.toJSON();
        })
        .put('/:lectureId', async ({ params, body, user }) => {
          const parsedBody = updateLessonSchema.parse(body);
          const lecture = await this.updateLectureUseCase.execute({
            courseId: params.id,
            lectureId: params.lectureId,
            description: parsedBody.description,
            preview: parsedBody.preview,
            title: parsedBody.title,
            actor: user,
          });
          return lecture;
        })
        .delete('/:lectureId', async ({ params, user }) => {
          await this.deleteLectureUseCase.execute({
            actor: user,
            courseId: params.id,
            lectureId: params.lectureId,
          });
        })
        .post('/:lectureId/assets', async ({ body, user, params }) => {
          const parsedBody = addAssetToLectureSchema.parse(body);
          await this.addAssetToLectureUseCase.execute({
            resourceType: parsedBody.resourceType,
            key: parsedBody.key,
            fileName: parsedBody.fileName,
            uuid: parsedBody.uuid,
            courseId: params.id,
            lectureId: params.lectureId,
            actor: user,
          });
          return {};
        }),
    );
  }
}
