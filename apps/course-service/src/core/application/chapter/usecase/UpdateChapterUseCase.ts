import type { UpdateChapterPort } from '@core/application/chapter/port/usecase/UpdateChapterPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';

export interface UpdateChapterUseCase
  extends UseCase<UpdateChapterPort, ChapterUseCaseDto> {}
