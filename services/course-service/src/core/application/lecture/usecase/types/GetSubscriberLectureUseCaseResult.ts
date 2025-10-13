import type { AssetUseCaseDto } from '@core/application/asset/usecase/dto/AssetUseCaseDto';
import type { LectureUseCaseDto } from '@core/application/lecture/usecase/dto/LectureUseCaseDto';

export type GetSubscriberLectureUseCaseResult = {
  lecture: LectureUseCaseDto;
  asset: AssetUseCaseDto;
};
