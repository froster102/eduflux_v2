import type { CreateChapterPort } from '@core/application/chapter/port/usecase/CreateChapterPort';
import type { UseCase } from '@core/common/usecase/UseCase';
import type { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';

export interface CreateChapterUseCase
  extends UseCase<CreateChapterPort, ChapterUseCaseDto> {}
