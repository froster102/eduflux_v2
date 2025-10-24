import type { GetSubscriberLecturePort } from '@core/application/lecture/port/usecase/GetSubscriberLecturePort';
import type { GetSubscriberLectureUseCaseResult } from '@core/application/lecture/usecase/types/GetSubscriberLectureUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetSubscriberLectureUseCase
  extends UseCase<
    GetSubscriberLecturePort,
    GetSubscriberLectureUseCaseResult
  > {}
