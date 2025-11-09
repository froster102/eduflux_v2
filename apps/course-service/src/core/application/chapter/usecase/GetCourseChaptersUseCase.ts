import type { GetCourseChaptersPort } from '@core/application/chapter/port/usecase/GetCourseChaptersPort';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetCourseChaptersUseCase
  extends UseCase<GetCourseChaptersPort, Chapter[]> {}
