import type { DeleteChapterPort } from '@core/application/chapter/port/usecase/DeleteChatperPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface DeleteChapterUseCase
  extends UseCase<DeleteChapterPort, void> {}
