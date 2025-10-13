import type { CreateChapterPort } from '@core/application/chapter/port/usecase/CreateChapterPort';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CreateChapterUseCase
  extends UseCase<CreateChapterPort, Chapter> {}
