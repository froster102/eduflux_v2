import type { PublishCourseRevisionPort } from '@core/application/course/port/persistence/PublishCourseRevisionPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface PublishCourseRevisionUseCase
  extends UseCase<PublishCourseRevisionPort, void> {}
