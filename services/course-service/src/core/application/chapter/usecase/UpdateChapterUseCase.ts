import type { UpdateChapterPort } from '@core/application/chapter/port/usecase/UpdateChapterPort';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface UpdateChapterUseCase
  extends UseCase<UpdateChapterPort, Chapter> {}
