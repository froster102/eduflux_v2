import type { SetCoursePricingPort } from '@core/application/course/port/usecase/SetCoursePricingPort';
import type { Course } from '@core/domain/course/entity/Course';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface SetCoursePricingUseCase
  extends UseCase<SetCoursePricingPort, Course> {}
