import type { DeleteChapterPort } from '@core/application/chapter/port/usecase/DeleteChatperPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface DeleteChapterUseCase
  extends UseCase<DeleteChapterPort, void> {}
