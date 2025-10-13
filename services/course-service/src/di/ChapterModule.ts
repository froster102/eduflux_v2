import { ChapterController } from '@api/http-rest/controller/ChapterController';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import { CreateChapterService } from '@core/application/chapter/service/CreateChapterService';
import { DeleteChapterService } from '@core/application/chapter/service/DeleteChapterService';
import { GetCourseChaptersService } from '@core/application/chapter/service/GetCourseChaptersService';
import { UpdateChapterService } from '@core/application/chapter/service/UpdateChapterService';
import type { CreateChapterUseCase } from '@core/application/chapter/usecase/CreateChapterUseCase';
import type { DeleteChapterUseCase } from '@core/application/chapter/usecase/DeleteChapterUseCase';
import type { GetCourseChaptersUseCase } from '@core/application/chapter/usecase/GetCourseChaptersUseCase';
import type { UpdateChapterUseCase } from '@core/application/chapter/usecase/UpdateChapterUseCase';
import { MongooseChapterRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/chapter/MongooseChapterRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const ChapterModule: ContainerModule = new ContainerModule((options) => {
  // Use cases
  options
    .bind<CreateChapterUseCase>(ChapterDITokens.CreateChapterUseCase)
    .to(CreateChapterService);
  options
    .bind<GetCourseChaptersUseCase>(ChapterDITokens.GetCourseChaptersUseCase)
    .to(GetCourseChaptersService);
  options
    .bind<DeleteChapterUseCase>(ChapterDITokens.DeleteChapterUseCase)
    .to(DeleteChapterService);
  options
    .bind<UpdateChapterUseCase>(ChapterDITokens.UpdateChapterUseCase)
    .to(UpdateChapterService);

  // Controller
  options
    .bind<ChapterController>(ChapterDITokens.ChapterController)
    .to(ChapterController);

  //Repository
  options
    .bind<ChapterRepositoryPort>(ChapterDITokens.ChapterRepository)
    .to(MongooseChapterRepositoryAdapter);
});
