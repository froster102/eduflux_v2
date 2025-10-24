import type { PublishCourseRevisionPort } from '@core/application/course/port/persistence/PublishCourseRevisionPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface PublishCourseRevisionUseCase
  extends UseCase<PublishCourseRevisionPort, void> {}
