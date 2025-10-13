import { LectureController } from '@api/http-rest/controller/LectureController';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { CreateLectureService } from '@core/application/lecture/service/CreateLectureService';
import { DeleteLectureService } from '@core/application/lecture/service/DeleteLectureService';
import { GetSubscriberLectureService } from '@core/application/lecture/service/GetSubscriberLectureService';
import { UpdateLectureService } from '@core/application/lecture/service/UpdateLectureService';
import type { CreateLectureUseCase } from '@core/application/lecture/usecase/CreateLectureUseCase';
import type { DeleteLectureUseCase } from '@core/application/lecture/usecase/DeleteLectureUseCase';
import type { GetSubscriberLectureUseCase } from '@core/application/lecture/usecase/GetSubscriberLectureUseCase';
import type { UpdateLectureUseCase } from '@core/application/lecture/usecase/UpdateLectureUseCase';
import { MongooseLectureRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/lecture/MongooseLectureRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const LectureModule: ContainerModule = new ContainerModule((options) => {
  // Use cases
  options
    .bind<CreateLectureUseCase>(LectureDITokens.CreateLectureUseCase)
    .to(CreateLectureService);
  options
    .bind<GetSubscriberLectureUseCase>(
      LectureDITokens.GetSubscriberLectureUseCase,
    )
    .to(GetSubscriberLectureService);
  options
    .bind<DeleteLectureUseCase>(LectureDITokens.DeleteLectureUseCase)
    .to(DeleteLectureService);
  options
    .bind<UpdateLectureUseCase>(LectureDITokens.UpdateLectureUseCase)
    .to(UpdateLectureService);

  // Controller
  options
    .bind<LectureController>(LectureDITokens.LectureController)
    .to(LectureController);

  //Repository
  options
    .bind<LectureRepositoryPort>(LectureDITokens.LectureRepository)
    .to(MongooseLectureRepositoryAdapter);
});
